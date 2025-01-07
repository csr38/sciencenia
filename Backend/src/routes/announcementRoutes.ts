import express from 'express';
import announcementController from '../controllers/announcementController';
import checkJwt from 'middleware/auth';

const router = express.Router();

router.post("/", checkJwt, announcementController.createAnnouncement);
router.get("/active/:studentId",  announcementController.getActiveAnnouncements);
router.get("/active", checkJwt, announcementController.getActiveAnnouncementsCurrentUser);
router.get("/:id", checkJwt, announcementController.getAnnouncementById);
router.get("/", checkJwt, announcementController.getAllAnnouncements);
router.delete("/:id", checkJwt, announcementController.deleteAnnouncement);
router.patch("/:id/close", checkJwt, announcementController.closeAnnouncement);
router.patch("/:id", checkJwt, announcementController.updateAnnouncement);

export default router;
