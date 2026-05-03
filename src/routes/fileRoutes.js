import { Router } from 'express';
import upload from '../config/multer.js';
import requireAuth from '../middlewares/requireAuth.js';
import {
  showUploadForm,
  postUploadFile,
  listFiles,
  showFileById,
  downloadFile,
} from '../controllers/fileController.js';

const router = Router();

router.get('/', requireAuth, listFiles);
router.get('/upload', requireAuth, showUploadForm);
router.post(
  '/upload',
  requireAuth,
  (req, res, next) => {
    upload.single('file')(req, res, function (err) {
      if (err) {
        // multer errors
        if (err.name === 'MulterError') {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return res.render('files/upload', {
              error: 'File too large. Max size is 8MB.',
            });
          }
        }

        // invalid file type error
        return res.render('files/upload', {
          error: err.message,
        });
      }

      next();
    });
  },
  postUploadFile,
);
router.get('/:id', requireAuth, showFileById);
router.get('/:id/download', requireAuth, downloadFile);

export default router;
