import express from 'express';
import researcherController from '../controllers/researcherController';
import { upload, uploadToMemBuffer } from 'multer/config/multerConfig';
import checkJwt from 'middleware/auth';

const router = express.Router();

router.post("/", checkJwt, researcherController.createResearcher);
router.post("/upload/researchers", checkJwt, uploadToMemBuffer.single('file'), researcherController.uploadFile);
router.post("/researchLine", researcherController.getResearchersbyResearchLine);
router.get("/", researcherController.getAllResearchers);
router.get("/:email", researcherController.getResearcher);
router.delete("/:email", checkJwt, researcherController.deleteResearcher);
router.delete("/", checkJwt, researcherController.deleteAllResearchers);
router.put("/addPicture/:email", checkJwt, upload.single('file'), researcherController.addPictureToResearcher);
router.put("/:email", checkJwt, researcherController.updateResearcher);

export default router;