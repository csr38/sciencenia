import express from 'express';
import requestController from '../controllers/requestController';
import checkJwt from 'middleware/auth';
import { upload } from 'multer/config/multerConfig';

const router = express.Router();

router.post("/", checkJwt, upload.array('files', 10), requestController.createRequest);
router.get("/getById/:id", checkJwt, requestController.getRequestById);
router.get("/status/:statusType", checkJwt, requestController.getAllRequestByStatusType);
router.get("/:email", checkJwt, requestController.getRequestByUser);
router.get("/", checkJwt, requestController.getAllRequest);
router.patch("/:id", checkJwt, requestController.patchRequest);
router.delete("/:id", checkJwt, requestController.deleteRequest);
router.post("/:id/attachFiles", upload.array('files', 10), checkJwt, requestController.attachFilesToRequest);
router.delete("/:id/removeFile/:fileId", checkJwt, requestController.removeFileFromRequest);

export default router;