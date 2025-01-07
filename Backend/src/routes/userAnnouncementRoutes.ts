import express from 'express';
import userAnnouncementController from '../controllers/userAnnouncementController';
import checkJwt from 'middleware/auth';

const router = express.Router();

router.post("/:announcementId/register", checkJwt, userAnnouncementController.registerStudentInAnnouncement);
router.get("/:announcementId/students", checkJwt, userAnnouncementController.getStudentsInAnnouncement);

export default router;
