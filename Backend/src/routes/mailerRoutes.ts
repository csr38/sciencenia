import express from 'express';
import mailerController from '../controllers/mailerController';

const router = express.Router();

router.post("/newUser", mailerController.sendNewAccountEmail);
router.post("/requestResponse", mailerController.sendRequestResponse);

export default router;