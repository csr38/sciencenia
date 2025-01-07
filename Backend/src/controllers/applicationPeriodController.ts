import { User } from 'db/models/user';
import {ApplicationPeriod} from '../db/models/applicationPeriod';
import { ValidationError } from 'sequelize';

export const createApplicationPeriod = async (req, res) => {
    try {
        const applicationPeriodData = req.body;
        const auth0Id = req.auth.payload.sub;
        const user = await User.findOne({where: {auth0Id: auth0Id}});
        if (user?.roleId !== 1) {
            return res.status(403).json({ message: "Access denied: Only executives can create application periods." });
        }
        const newPeriod = await ApplicationPeriod.create({
            periodTitle: applicationPeriodData.periodTitle,
            periodDescription: applicationPeriodData.periodDescription,
            statusApplication: applicationPeriodData.statusApplication,
            startDate: applicationPeriodData.startDate,
            endDate: applicationPeriodData.endDate,
            totalBudget: applicationPeriodData.totalBudget
        });
        res.status(201).json(newPeriod);
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
        res.status(500).json({ message: "Error creating period" });
    }
};

export const getAllPeriod = async (req, res) => {
    try {
        const periods = await ApplicationPeriod.findAll();
        res.status(200).json(periods);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error getting Periods" });
    }
};

export const getPeriodById = async (req, res) => {
    try {
        const periodId = req.params.periodId;
        const period = await ApplicationPeriod.findOne({
            where: { id: periodId },
        });
        if (!period) {
            res.status(400).json({ message: "Period not found" });
            return;
        }
        res.status(200).json(period);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error getting Period" });
    }
};

async function checkNewBudget (usedBudget, newBudget) {

    for (const grade in usedBudget) {
        if (newBudget[grade] !== undefined && newBudget[grade] !== null) {
        if (usedBudget[grade] > newBudget[grade]) {
            return {valid: false, message: `The new budget for ${grade} is less than the used budget`};
        }
    }
    }
    return {valid: true};
}

export const getBudgetsByPeriodId = async (req, res) => {
    try {
        const periodId = req.params.periodId;
        const period = await ApplicationPeriod.findOne({
            where: { id: periodId },
        });
        if (!period) {
            res.status(400).json({ message: "Period not found" });
            return;
        }
        const usedBudget = period.usedBudget;
        const totalBudget = period.totalBudget;
        const availableBudget = {};
        for (const grade in totalBudget) {
            availableBudget[grade] = totalBudget[grade] - usedBudget[grade];
        }
        res.status(200).json(availableBudget);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error getting Period" });
    }
}

export const updateApplicationPeriod = async (req, res) => {
    try {
        const applicationPeriodData = req.body;
        const periodId = req.params.periodId;
        const auth0Id = req.auth.payload.sub;
        const user = await User.findOne({where: {auth0Id: auth0Id}});
        const period = await ApplicationPeriod.findByPk(periodId);
        if (!period) {
            res.status(400).json({ message: "Period not found" });
            return;
        }
        
        
        if (user?.roleId !== 1) {
            return res.status(403).json({ message: "Access denied: Only executives can update application periods." });
        }
        const usedBudget = period.usedBudget;
        const newBudget = applicationPeriodData.totalBudget;
        const validate = await checkNewBudget(usedBudget, newBudget);
        if (!validate.valid) {
            return res.status(400).json({ message: validate.message });
        }
        const [rowsAffected, [updatedPeriod]] = await ApplicationPeriod.update(applicationPeriodData, {
            where: {
                id: periodId
            },
            returning: true
        });
        if (rowsAffected === 0 || !updatedPeriod) {
            res.status(400).json({ message: "Application Period does not exist or no changes were made" });
            return;
        }
        res.status(200).json(updatedPeriod);
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
        res.status(500).json({ message: "Error updating period" });
    }
};

export const deleteApplicationPeriod = async (req, res) => {
    try {
        const periodId = req.params.periodId;
        const period = await ApplicationPeriod.findByPk(periodId);
        const auth0Id = req.auth.payload.sub;
        const user = await User.findOne({where: {auth0Id: auth0Id}});
        if (!period) {
            res.status(400).json({ message: "Period not found" });
            return;
        }
        if (user?.roleId !== 1) {
            return res.status(403).json({ message: "Access denied: Only executives can delete application periods." });
        }
        await ApplicationPeriod.destroy({
            where: {
                id: periodId
            }
        });
        res.status(200).json({ message: "Application Period deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting period" });
    }
};


export default {
    createApplicationPeriod,
    getAllPeriod,
    getPeriodById,
    updateApplicationPeriod,
    deleteApplicationPeriod,
    getBudgetsByPeriodId
}