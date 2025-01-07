import express from 'express';
import thesisController from '../controllers/thesisController';
import checkJwt from 'middleware/auth';

const router = express.Router();

router.post("/", checkJwt, thesisController.createThesis);
router.get("/", checkJwt, thesisController.getAllThesis);
router.get("/:email", checkJwt, thesisController.getThesisByUser);
router.delete("/:id", checkJwt, thesisController.deleteThesis);
router.patch("/:id", checkJwt, thesisController.patchThesis);

export default router;