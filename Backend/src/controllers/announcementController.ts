import { Request, Response } from 'express';
import { Announcement } from '../db/models/announcement';
import { User } from 'db/models/user';
import { Op } from 'sequelize';
import { sendAnnouncementEmail } from './mailerController';
import { sendPushNotification } from 'notifications';
import { UserAnnouncement } from 'db/models/userAnnouncement';

const createAnnouncement = async (req: Request, res: Response) => {
  try {
    if (req.requesterUser.roleId !== 1) {
      return res.status(403).json({ error: 'Unauthorized: Only executives can create announcements' });
    }

    const { title, description, targetAudiences } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    if (!Array.isArray(targetAudiences) || targetAudiences.some(audience => typeof audience !== 'string')) {
      return res.status(400).json({ error: 'Invalid target audiences.' });
    }

    const announcement = await Announcement.create({
      title,
      description,
      targetAudiences,
    });

    const students = await User.findAll({
      where: {
        roleId: 2,
        academicDegree: {
          [Op.in]: targetAudiences,
        },
      },
    });

    const emailAddresses = students.map(student => student.email);
    const validTokens = students.map(student => student.firebaseToken).filter(token => token !== null);

    if (emailAddresses.length > 0) {
      await sendAnnouncementEmail(announcement, emailAddresses);
    }

    if (validTokens.length > 0) {
      const notificationPromises = validTokens.map(token =>
        sendPushNotification(token, `Nuevo anuncio: ${title}`, description)
      );
      await Promise.all(notificationPromises);
    }

    return res.status(201).json({
      message: 'Announcement created successfully',
      announcement,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error creating announcement' });
  }
};

const getActiveAnnouncementsCurrentUser = async (req: Request, res: Response) => {
  req.params.studentId = req.requesterUser.id;
  return getActiveAnnouncements(req, res);
}

// Obtener todos los anuncios activos (para estudiantes)
const getActiveAnnouncements = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;

    if (!studentId) {
      return res.status(400).json({ error: 'Student ID is required' });
    }

    const student = await User.findOne({
      where: { id: studentId, roleId: 2 },
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found or not a valid user' });
    }

    const { academicDegree } = student;

    const allAudiences = [
      "Grado de Doctorado",
      "Equivalente a Magister",
      "Grado de Licenciatura o Título Profesional",
    ];

    const whereClause = academicDegree
      ? {
          isClosed: false,
          [Op.or]: [
            { targetAudiences: { [Op.contains]: [academicDegree] } },
            { targetAudiences: { [Op.contains]: allAudiences } },
          ],
        }
      : {
          isClosed: false,
          targetAudiences: { [Op.contains]: allAudiences },
        };

    const allAnnouncements = await Announcement.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          through: { attributes: [] },
          as: 'interestedStudents',
          attributes: ['id'],
        },
      ],
    });

    const registeredAnnouncements = await Promise.all(
      allAnnouncements
        .filter((announcement) =>
          announcement.interestedStudents?.some((user) => user.id === parseInt(studentId))
        )
        .map(async (announcement) => {
          const userAnnouncement = await UserAnnouncement.findOne({
            where: {
              announcementId: announcement.id,
              userId: parseInt(studentId),
            },
            attributes: ['motivationMessage'],
          });

          return {
            ...announcement.toJSON(),
            motivationMessage: userAnnouncement?.motivationMessage || null,
          };
        })
    );

    const notRegisteredAnnouncements = allAnnouncements.filter(
      (announcement) =>
        !announcement.interestedStudents?.some((user) => user.id === parseInt(studentId))
    );

    const response = {
      registeredAnnouncements,
      notRegisteredAnnouncements,
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error fetching active announcements' });
  }
};

// Obtener todos los anuncios (para el ejecutivo)
const getAllAnnouncements = async (req: Request, res: Response) => {
  try {
    if (req.requesterUser.roleId !== 1) {
      return res.status(403).json({ error: 'Unauthorized: Only executives can see all announcements' });
    }

    const degreeMap: Record<number, string[]> = {
      1: ["Grado de Doctorado"],
      2: ["Equivalente a Magister"],
      3: ["Grado de Licenciatura o Título Profesional"],
    };

    const { academicDegree } = req.query;

    const degreeKey = parseInt(academicDegree as string, 10);

    if (academicDegree && (!degreeKey || !degreeMap[degreeKey])) {
      return res.status(400).json({ error: 'Invalid academicDegree value. Use 1, 2 or 3.' });
    }

    const targetAudiences = degreeMap[degreeKey] || []; // Si no se especifica, devolver todos

    const whereClause = targetAudiences.length > 0
      ? { targetAudiences: { [Op.overlap]: targetAudiences } }
      : {}; // Sin filtro, devolver todos los anuncios

    const announcements = await Announcement.findAll({
      where: whereClause,
    });

    return res.status(200).json(announcements);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error fetching announcements' });
  }
};

const deleteAnnouncement = async (req: Request, res: Response) => {
  try {
    if (req.requesterUser.roleId !== 1) {
      return res.status(403).json({ error: 'Unauthorized: Only executives can delete announcements' });
    }

    const { id } = req.params;

    const announcement = await Announcement.findByPk(id);

    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    await announcement.destroy();

    return res.status(200).json({ error: 'Announcement deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error deleting announcement' });
  }
};

const closeAnnouncement = async (req: Request, res: Response) => {
  try {
    if (req.requesterUser.roleId !== 1) {
      return res.status(403).json({ error: 'Unauthorized: Only executives can close announcements' });
    }

    const { id } = req.params;

    const announcement = await Announcement.findByPk(id);

    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    announcement.isClosed = true;
    await announcement.save();

    return res.status(200).json({ message: 'Announcement closed successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error closing announcement' });
  }
};

const updateAnnouncement = async (req: Request, res: Response) => {
  try {
    if (req.requesterUser.roleId !== 1) {
      return res.status(403).json({ error: 'Unauthorized: Only executives can update announcements' });
    }

    const { id } = req.params;
    const { title, description, targetAudiences } = req.body;

    const announcement = await Announcement.findByPk(id);

    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    if (title) {
      announcement.title = title;
    }
    if (description) {
      announcement.description = description;
    }
    if (targetAudiences) {
      if (!Array.isArray(targetAudiences) || targetAudiences.some(audience => typeof audience !== 'string')) {
        return res.status(400).json({ error: 'Invalid target audiences. It must be an array of strings.' });
      }
      announcement.targetAudiences = targetAudiences;
    }

    await announcement.save();

    return res.status(200).json({ message: 'Announcement updated successfully', announcement });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error updating announcement' });
  }
};

const getAnnouncementById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'Announcement ID is required' });
    }
    const announcement = await Announcement.findByPk(id);
    if (!announcement) {
      return res.status(404).json({ error: 'Announcement not found' });
    }
    return res.status(200).json(announcement);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error fetching announcement' });
  }
};


export default {
  createAnnouncement,
  getActiveAnnouncements,
  getActiveAnnouncementsCurrentUser,
  getAllAnnouncements,
  deleteAnnouncement,
  closeAnnouncement,
  updateAnnouncement,
  getAnnouncementById,
};
