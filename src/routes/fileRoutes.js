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
router.post('/upload', requireAuth, upload.single('file'), postUploadFile);
router.get('/:id', requireAuth, showFileById);
router.get('/:id/download', requireAuth, downloadFile);

export default router;
