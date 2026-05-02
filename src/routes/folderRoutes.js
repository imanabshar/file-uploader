import { Router } from 'express';
import {
  showCreateFolderForm,
  postCreateFolder,
  listFolders,
  deleteFolder,
  showEditFolderForm,
  editFolder,
  showFolderById,
} from '../controllers/folderController.js';
import requireAuth from '../middlewares/requireAuth.js';

const router = Router();

router.get('/', requireAuth, listFolders);
router.get('/new', requireAuth, showCreateFolderForm);
router.post('/', requireAuth, postCreateFolder);
router.get('/:id', requireAuth, showFolderById);
router.post('/:id/delete', requireAuth, deleteFolder);
router.get('/:id/edit', requireAuth, showEditFolderForm);
router.post('/:id/edit', requireAuth, editFolder);

export default router;
