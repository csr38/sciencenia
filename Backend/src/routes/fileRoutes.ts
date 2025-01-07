import express from 'express';
import fileController from '../controllers/fileController';
import checkJwt from '../middleware/auth';
import { upload } from 'multer/config/multerConfig';

const router = express.Router();

router.post("/", checkJwt, upload.single('file'), fileController.uploadFile);
router.get("/:id", checkJwt, fileController.getFileById);
router.delete('/:id', checkJwt, fileController.deleteFileById);

export default router;
