import express from 'express';
import applicationPeriodController from '../controllers/applicationPeriodController';
import checkJwt from 'middleware/auth';

const router = express.Router();

router.post("/", checkJwt, applicationPeriodController.createApplicationPeriod);
router.get("/", applicationPeriodController.getAllPeriod);
router.get("/:periodId", applicationPeriodController.getPeriodById);
router.patch("/:periodId", checkJwt, applicationPeriodController.updateApplicationPeriod);
router.delete("/:periodId", checkJwt, applicationPeriodController.deleteApplicationPeriod);
router.get("/budget/:periodId", applicationPeriodController.getBudgetsByPeriodId);

export default router;