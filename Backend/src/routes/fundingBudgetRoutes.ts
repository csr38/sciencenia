import express from 'express';
import fundingBudgetController from 'controllers/fundingBudgetController';
import checkJwt from 'middleware/auth';

const router = express.Router();

router.post("/", checkJwt, fundingBudgetController.createFundingBudget);
router.get("/", checkJwt, fundingBudgetController.getAllBudgets);
router.get("/:id", checkJwt, fundingBudgetController.getBudgetById);
router.patch("/:id", checkJwt, fundingBudgetController.updateBudget);
router.delete("/:id", checkJwt, fundingBudgetController.deleteBudget);
router.get("requests/:id", checkJwt, fundingBudgetController.getAllFundingRequestsByBudgetId);

export default router;