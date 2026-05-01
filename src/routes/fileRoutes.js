import { Router } from 'express';
import upload from '../config/multer.js';
import requireAuth from '../middlewares/requireAuth.js';
import {
  showUploadForm,
  postUploadFile,
} from '../controllers/fileController.js';

const router = Router();

router.get('/upload', requireAuth, showUploadForm);
router.post('/upload', requireAuth, upload.single('file'), postUploadFile);

export default router;
