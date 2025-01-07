import express from 'express';
import researchController from '../controllers/researchController';
import checkJwt from 'middleware/auth';
import { uploadToMemBuffer } from 'multer/config/multerConfig';

const router = express.Router();

router.get("/filter-options/", researchController.getFilterOptions);
router.post("/search/", researchController.search);
router.post("/searchAnyField/", researchController.searchOnAnyField);
router.post("/upload/", checkJwt, uploadToMemBuffer.single('file'), researchController.bulkUpload);
router.get("/:id", researchController.getResearchById);

export default router;