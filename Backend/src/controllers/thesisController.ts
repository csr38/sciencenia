import { ValidationError } from 'sequelize';
import {Thesis} from '../db/models/thesis';
import {User} from '../db/models/user';


export const createThesis = async (req, res) => {
    try {
        const thesisData = req.body;
        const requesterUser = req.requesterUser;
        if (requesterUser.roleId !== 1 && requesterUser.email !== thesisData.email) {
            return res.status(403).json({ message: "Access denied: You are not authorized to create a thesis for another user." });
        }
        const user = thesisData.email ? await User.findOne({where: {email: thesisData.email}}) : requesterUser;
        if(!user){
            res.status(400).json({ message: "User does not exist" });
            return;
        }
        if(user.roleId !== 2){
            res.status(400).json({ message: "User is not a student" });
            return;
        }
        const thesis = await Thesis.findOne({where: {userId: user.id}});
        if (!thesis) {
            const newThesis = await Thesis.create({
                title: thesisData.title,
                status: thesisData.status,
                startDate: thesisData.startDate,
                endDate: thesisData.endDate,
                extension: thesisData.extension,
                resourcesRequested: thesisData.resourcesRequested,
                userId: user.id,
            });
            res.status(201).json(newThesis);
        } else {
            res.status(200).json({ message: "User has a thesis already" });
        }
    } catch (error) {
        if(error instanceof ValidationError) {
            res.status(400).json({ 
                message: "Validation Error",
                errors: error.errors.map((error) => ({
                    path: error.path,
                    type: error.type,
                    message: error.message, 
                }))
            });
            return;
        }
        console.error(error);
        res.status(500).json({ message: "Error creating research" });
    }
};

export const getAllThesis = async (req, res) => {
    try {
        if (req.requesterUser.roleId !== 1) {
            res.status(403).json({ message: "Access denied: Only executives can view all thesis" });
            return;
        };
        const thesis = await Thesis.findAll();
        res.status(200).json(thesis);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error getting research" });
    }

};

export const getThesisByUser = async (req, res) => {
    try {
        const email = req.params.email;
        const user = await User.findOne({where: {email: email}});
        const requesterUser = req.requesterUser;
        if (requesterUser?.roleId === 2 && requesterUser?.email !== email) {
            return res.status(403).json({ message: "Access denied: You are not authorized to view this user." });
        }
        if (!user) {
            res.status(400).json({ message: "User does not exist" });
            return;
        };
        const thesis = await Thesis.findOne({where: {userId: user.id}});
        if (!thesis) {
            res.status(400).json({ message: "Thesis not found" });
            return;
        }
        return res.status(200).json(thesis);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error getting thesis" });
    }

};

export const deleteThesis = async (req, res) => {
    try {
      const idThesis = req.params.id
      const thesis = await Thesis.findOne({ where: { id: idThesis } });
      const requesterUser = req.requesterUser;
      console.log("THESIS:", thesis);
      if (!thesis) {
          res.status(400).json({ message: "Thesis not found" });
          return;
        }
        if (requesterUser?.roleId !== 1 && requesterUser?.id !== thesis.userId) {
            return res.status(403).json({ message: "Access denied: Only executives can delete thesis." });
        }
      await Thesis.destroy({
        where: {
            id: idThesis,
        }
      });
      res.status(200).json({ message: "Thesis removed" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error deleting Thesis" });
    }
};

export const patchThesis = async (req, res) => {
    try {
        const idThesis = req.params.id;
        const thesis = await Thesis.findOne({ where: { id: idThesis } });
        const requesterUser = req.requesterUser;
        if (requesterUser.roleId!==1 && requesterUser?.id !== thesis.userId) {
            return res.status(403).json({ message: "Access denied: You are not authorized to update this thesis." });
        }

        const updatedFields = {
            title: req.body.title,
            status: req.body.status,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            extension: req.body.extension,
            resourcesRequested: req.body.resourcesRequested,
        }
        const [rowsAffected, [updatedThesis]] = await Thesis.update(updatedFields, {
            where: {
            id: idThesis
            },
            returning: true 
        });
        if (rowsAffected === 0 || !updatedThesis) { 
            res.status(400).json({ message: "Thesis does not exist or no changes were made" });
            return;
        }
        res.status(200).json(updatedThesis);
    } catch (error) {
        if(error instanceof ValidationError) {
            res.status(400).json({ 
                message: "Validation Error",
                errors: error.errors.map((error) => ({
                    path: error.path,
                    type: error.type,
                    message: error.message, 
                }))
            });
            return;
        }
        console.error(error);
        res.status(500).json({ message: "Error updating thesis" });
    }
};

export default {
    createThesis,
    getAllThesis,
    getThesisByUser,
    deleteThesis,
    patchThesis
}