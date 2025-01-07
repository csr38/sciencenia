import express from 'express';
import scholarshipController from '../controllers/scholarshipController';
import checkJwt from 'middleware/auth';
import { upload } from 'multer/config/multerConfig';

const router = express.Router();

router.post("/", checkJwt, upload.array('files', 10), scholarshipController.createScholarship);
router.get("/", checkJwt ,scholarshipController.getAllScholarship);
router.get("/:id", checkJwt, scholarshipController.getScolarshipById);
router.get("/check/:id", checkJwt, scholarshipController.checkProfileAndThesis);
router.patch("/:id", checkJwt, scholarshipController.patchScholarship);
router.delete("/:id", checkJwt, scholarshipController.deleteScholarship);
router.post("/:id/attachFiles", upload.array('files', 10), checkJwt, scholarshipController.attachFilesToScholarship);
router.delete("/:id/removeFile/:fileId", checkJwt, scholarshipController.removeFileFromScholarship);

export default router;