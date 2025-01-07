import { Request, Response } from 'express';
import { Announcement } from '../db/models/announcement';
import { User } from '../db/models/user';
import { UserAnnouncement } from '../db/models/userAnnouncement';

const registerStudentInAnnouncement = async (req: Request, res: Response) => {
  try {
    const { announcementId } = req.params;
    const { motivationMessage } = req.body;

    const announcement = await Announcement.findByPk(announcementId);
    if (!announcement || announcement.isClosed) {
      return res.status(404).json({ error: 'Announcement not found or is closed' });
    }

    const userId = req.requesterUser.id;

    const user = await User.findByPk(userId);
    if (user.roleId !== 2) { 
      return res.status(403).json({ error: 'User is not a student or does not exist' });
    }

    await UserAnnouncement.create({
      announcementId: Number(announcementId),
      userId: Number(userId),
      motivationMessage,
    });

    return res.status(201).json({ message: 'Student registered successfully in the announcement' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error registering student in the announcement' });
  }
};

const getStudentsInAnnouncement = async (req: Request, res: Response) => {
  try {
    if (req.requesterUser.roleId !== 1) {
      return res.status(403).json({ error: 'Unauthorized: Only executives can view registered students' });
    }

    const { announcementId } = req.params;

    const announcement = await Announcement.findByPk(announcementId, {
      include: [
        {
          model: User,
          as: 'interestedStudents',
          attributes: ['id', 'username', 'email'],
          through: { attributes: ['motivationMessage'] },
        },
      ],
    });

    if (!announcement) {
      return res.status(404).json({ error: 'Announcement not found' });
    }

    return res.status(200).json({ students: announcement.interestedStudents });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error fetching students for the announcement' });
  }
};

export default {
  registerStudentInAnnouncement,
  getStudentsInAnnouncement,
};
