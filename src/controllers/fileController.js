import { prisma } from '../lib/prisma.js';
import parseId from '../lib/parseId.js';

async function showUploadForm(req, res) {
  const folderId = req.query.folderId || null;
  const returnTo =
    req.query.returnTo || (folderId ? `/folders/${folderId}` : '/files');
  res.render('files/upload', { folderId, returnTo });
}

async function postUploadFile(req, res, next) {
  try {
    const folderId = req.query.folderId ? parseInt(req.query.folderId) : null;
    const returnTo =
      req.body.returnTo ||
      req.query.returnTo ||
      (folderId ? `/folders/${folderId}` : '/files');

    if (!req.file) {
      return res.render('files/upload', {
        error: 'Please select a file',
        folderId,
        returnTo,
      });
    }

    await prisma.file.create({
      data: {
        name: req.file.originalname,
        size: req.file.size,
        url: req.file.path,
        userId: req.user.id,
        folderId: folderId,
      },
    });

    res.redirect(returnTo);
  } catch (error) {
    next(error);
  }
}

async function listFiles(req, res, next) {
  try {
    const files = await prisma.file.findMany({
      where: { userId: req.user.id },
    });

    res.render('files/index', { files });
  } catch (error) {
    next(error);
  }
}

async function showFileById(req, res, next) {
  try {
    const fileId = parseId(req.params.id, res);
    if (!fileId) return;

    const file = await prisma.file.findUnique({
      where: { id: fileId },
    });

    if (!file) {
      return res.status(404).render('errorPage', {
        message: "Sorry! File doesn't exist",
      });
    }

    //check if file belongs to that user
    if (file.userId !== req.user.id) {
      return res.status(403).render('errorPage', {
        message: 'Insufficient Permission',
      });
    }

    const returnTo = req.query.returnTo || '/files';
    res.render('files/show', { file, returnTo });
  } catch (error) {
    next(error);
  }
}

async function downloadFile(req, res, next) {
  try {
    const fileId = parseId(req.params.id, res);
    if (!fileId) return;

    const file = await prisma.file.findUnique({
      where: { id: fileId },
    });

    if (!file) {
      return res.status(404).render('errorPage', {
        message: "Sorry! File doesn't exist",
      });
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
    next(error);
  }
}

export {
  showUploadForm,
  postUploadFile,
  listFiles,
  showFileById,
  downloadFile,
};
