import { prisma } from '../lib/prisma.js';

async function showUploadForm(req, res) {
  const folderId = req.query.folderId || null;
  res.render('files/upload', { folderId });
}

async function postUploadFile(req, res) {
  try {
    if (!req.file) {
      return res.render('upload', { error: 'Please select a file' });
    }

    const folderId = req.query.folderId ? parseInt(req.query.folderId) : null;

    await prisma.file.create({
      data: {
        name: req.file.originalname,
        size: req.file.size,
        url: req.file.path,
        userId: req.user.id,
        folderId: folderId,
      },
    });

    res.redirect('/');
  } catch (error) {
    console.error(error);
  }
}

async function listFiles(req, res) {
  try {
    const files = await prisma.file.findMany({
      where: { userId: req.user.id },
    });

    res.render('files/index', { files });
  } catch (error) {
    console.error(error);
  }
}

async function showFileById(req, res) {
  try {
    const fileId = parseInt(req.params.id);

    const file = await prisma.file.findUnique({
      where: { id: fileId },
    });

    if (!file) {
      return res.status(404).send('File not found');
    }

    //check if file belongs to that user
    if (file.userId !== req.user.id) {
      return res.status(403).render('errorPage', {
        message: 'Insufficient Permission',
      });
    }

    res.render('files/show', { file });
  } catch (error) {
    console.error(error);
  }
}

async function downloadFile(req, res) {
  try {
    const fileId = parseInt(req.params.id);

    const file = await prisma.file.findUnique({
      where: { id: fileId },
    });

    if (!file) {
      return res.status(404).send('File not found');
    }

    //check if file belongs to that user
    if (file.userId !== req.user.id) {
      return res.status(403).render('errorPage', {
        message: 'Insufficient Permission',
      });
    }

    const response = await fetch(file.url);
    const buffer = await response.arrayBuffer();

    res.setHeader('Content-Disposition', `attachment; filename="${file.name}"`);
    res.setHeader('Content-Type', response.headers.get('content-type'));
    res.send(Buffer.from(buffer));
  } catch (error) {
    console.error(error);
  }
}

export {
  showUploadForm,
  postUploadFile,
  listFiles,
  showFileById,
  downloadFile,
};
