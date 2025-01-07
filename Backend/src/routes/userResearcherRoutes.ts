import express from 'express';
import userResearcherController from 'controllers/userResearcherController';
//import checkJwt from 'middleware/auth';

const router = express.Router();

router.post("/", userResearcherController.createUserResearcher);
router.get("/user/:email", userResearcherController.getResearchersOfUser);
router.get("/researcher/:email", userResearcherController.getUsersOfResearcher);
router.get("/", userResearcherController.getAllUserResearchers);
router.delete("/", userResearcherController.deleteUserResearcher);


export default router;