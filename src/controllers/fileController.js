import { prisma } from '../lib/prisma.js';

async function showUploadForm(req, res) {
  res.render('upload');
}

async function postUploadFile(req, res, next) {
  try {
    if (!req.file) {
      return res.render('upload', { error: 'Please select a file' });
    }

    await prisma.file.create({
      data: {
        name: req.file.originalname,
        size: req.file.size,
        path: req.file.path,
        userId: req.user.id,
      },
    });

    res.redirect('/');
  } catch (err) {
    next(err);
  }
}

export { showUploadForm, postUploadFile };
