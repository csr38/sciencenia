import { User } from '../db/models/user';
import fileController from './fileController';
import dotenv from 'dotenv';
import { Researcher } from 'db/models/researcher';

dotenv.config();

export const createUser = async (req, res) => {
  try {
    const userData = req.body;
    const existingUser = await User.findOne({ where: { email:userData.email } });
    if (existingUser){
      return res.status(201).json({ message: "User already exists", existingUser });
    }
    
    if (userData.requesterUser) {
      const newUser = await User.create({
        username: userData.nickname,
        email: userData.email,  
        rut: userData.rut ?? "No informado",
        names: userData.names,
        lastName: userData.lastName,
        secondLastName: userData.secondLastName,
        gender: userData.gender,
        phoneNumber: userData.phoneNumber,
        academicDegree: userData.academicDegree,
        institution: userData.institution,
        fullNameDegree: userData.fullNameDegree,
        entryYear: userData.entryYear,
        researchLines: userData.researchLines,
        roleId: userData.roleId ?? 2,
      });
      return res.status(201).json(newUser);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error creating user" });
  }
};

export const uploadPicture = async (req, res) => {
  try {
    const user = req.requesterUser;
    const fileData = req.file;
    if (!fileData) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    if (fileData.size > 5 * 1024 * 1024) {
      return res.status(400).json({ message: 'Picture exceeds the 5MB limit' });
    }
    const file = await fileController.createFile(fileData);
    await user.update({ fileId: file.id });
    return res.status(200).json({ message: "Picture uploaded" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error uploading picture" });

  }
}
    
export const getAllUsers = async (req, res) => {
  try {
    const { role } = req.query;
    let roleId: number | undefined;

    if (role == "ejecutivo"){
      roleId = 1;
    } else if (role == "estudiante") {
      roleId = 2;
    }

    const users = roleId 
      ? await User.findAll({ where: { roleId: roleId } })
      : await User.findAll();

    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error getting users" });
  }
};

export const patchUser = async (req, res) => {
  try {
    const userToUpdateEmail = req.params.email;

    const requesterUser = req.requesterUser;
    const userToUpdate = await User.findOne({ where: { email: userToUpdateEmail} }) as User | null;

    const requesterRoleId = requesterUser?.roleId;
    const requesterUsername = requesterUser?.username;
    const usernameOfUserToUpdate = userToUpdate?.username;
    const isRequesterStudent = requesterRoleId === 2;

    if (isRequesterStudent && requesterUsername !== usernameOfUserToUpdate) {
      return res.status(403).json({ message: "You are not authorized to modify this user." });
    }

    if (req.body.auth0Id) {
      return res.status(403).json({ message: "You are not allowed to change this ." });
    }
    if (requesterRoleId === 2 && (req.body.roleId)) {
      return res.status(403).json({ message: "You are not allowed to change this." });
    }

    // if (requesterRoleId === 1 /*&& ( req.body.username || req.body.rut || req.body.gender )*/ ) {  
    //   return res.status(403).json({ message: "You are not allowed to change this." });
    // } 
    
    const updatedFields = { ...req.body };
    delete updatedFields.requesterEmail;

    const [rowsAffected, [updatedUser]] = await User.update(updatedFields, {
      where: {
        email: userToUpdateEmail
      },
      returning: true 
    });

    if (rowsAffected === 0 || !updatedUser) { 
      res.status(400).json({ message: "User does not exist or no changes were made" });
      return;
    }
    
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating user" });
  }
};

export const getUser = async (req, res) => {
  try {
    const email = req.params.email;
    const user = await User.findOne({ where: { email: email } }) as User | null;
    if (!user) {
      res.status(400).json({ message: "User does not exist" });
      return;
    };
    return res.status(200).json(user);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error getting users" });
  }
};

export const getUserRole = async (req, res) => {
  try {
    const email = req.params.email;
    const user = await User.findOne({where: {email: email}});
    if (!user) {
      res.status(400).json({ message: "User does not exist" });
      return;
    };
    res.status(200).json({roleId: user.roleId});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error getting users" });
  }
};

export const isUserRegistered = async (req, res) => {
  try {
    const email = req.params.email;
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      res.status(200).json({ registered: false });
      return;
    }
    res.status(200).json({ registered: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error checking user registration" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const requesterUser = req.requesterUser;

    if (requesterUser?.roleId !== 1) {
      return res.status(403).json({ message: "Access denied: Only executives can delete users." });
    }

    const email = req.params.email;
    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    
    if (user.roleId === 1 && requesterUser?.id !== user.id) {
      return res.status(403).json({ message: "You are not allowed to delete this user." });
    }

    await User.destroy({
      where: {
        email: email,
      }
    });

    res.status(200).json({ message: "User removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting User" });
  }
};

export const deleteAllUsers = async (req, res) => {
  try {
    const requesterUser = req.requesterUser;
    if (requesterUser?.roleId !== 1) {
      return res.status(403).json({ message: "Access denied: Only executives can delete all users." });
    }
    await User.destroy({ where: {}, truncate: true, cascade: true });
    return res.status(204).json({ message: "All users have been deleted." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error deleting users." });
  }
};

export const getStudentsOfTutor = async (req, res) => {
  try {
    const email = req.params.tutorEmail;
    const tutor = await Researcher.findOne({ where: { email: email } });
    if (!tutor) {
      res.status(400).json({ message: "Tutor not Found" });
      return;
    };

    const students = await tutor.$get('students');
    res.status(200).json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error getting users" });
  }
};

export const updateFirebaseToken = async (req, res) => {
  try {
    const { firebaseToken } = req.body;
    const userEmail = req.params.email;

    if (!firebaseToken) {
      return res.status(400).json({ message: "No token provided" });
    }

    const user = await User.findOne({ where: { email: userEmail } });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    await user.update({ firebaseToken });

    return res.status(200).json({ message: "Token uploaded" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error uploading token" });
  }
};

export default {
  createUser,
  getAllUsers,
  patchUser,
  getUser,
  getUserRole,
  isUserRegistered,
  deleteUser,
  deleteAllUsers,
  getStudentsOfTutor,
  uploadPicture,
  updateFirebaseToken,
};
