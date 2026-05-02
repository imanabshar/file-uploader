import { prisma } from '../lib/prisma.js';

async function showUploadForm(req, res) {
  const folderId = req.query.folderId || null;
  res.render('upload', { folderId });
}

async function postUploadFile(req, res, next) {
  try {
    if (!req.file) {
      return res.render('upload', { error: 'Please select a file' });
    }

    const folderId = req.query.folderId ? parseInt(req.query.folderId) : null;

    await prisma.file.create({
      data: {
        name: req.file.originalname,
        size: req.file.size,
        path: req.file.path,
        userId: req.user.id,
        folderId: folderId,
      },
    });

    res.redirect('/');
  } catch (err) {
    next(err);
  }
}

export { showUploadForm, postUploadFile };
