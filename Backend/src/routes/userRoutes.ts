import express from 'express';
import userController from '../controllers/userController';
import userImportController from '../controllers/userImportController';
import checkJwt from 'middleware/auth';
import { uploadToMemBuffer, uploadImage } from 'multer/config/multerConfig';

const router = express.Router();

router.post("/", userController.createUser);
router.get("/", userController.getAllUsers);
router.post("/upload", checkJwt, uploadToMemBuffer.single('file'), userImportController.uploadUsers);
router.post("/uploadPicture", checkJwt, uploadImage.single('file'), userController.uploadPicture);
router.get("/:email", checkJwt, userController.getUser);
router.get("/checkRegistered/:email", checkJwt, userController.isUserRegistered); 
router.patch("/:email", checkJwt, userController.patchUser);
router.patch("/updateFirebaseToken/:email", userController.updateFirebaseToken);
router.get("/getUserRole/:email", userController.getUserRole);
router.get("/getStudentsTutor/:tutorEmail", checkJwt, userController.getStudentsOfTutor);
router.delete("/", checkJwt, userController.deleteAllUsers);
router.delete("/:email", checkJwt, userController.deleteUser);

export default router;