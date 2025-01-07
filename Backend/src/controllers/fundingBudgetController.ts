import { FundingRequest } from '../db/models/fundingRequest';
import { User } from '../db/models/user';
import { FundingRequestFiles } from '../db/models/fundingRequestFiles';
import { FundingBudget } from '../db/models/fundingBudget';

export const createFundingBudget = async (req, res) => {
    try {
        if (req.requesterUser.roleId !== 1) {
            return res.status(403).json({ message: "Access denied: Only executives can create budgets." });
        }

        const fundingBudgetData = req.body;

        const newBudget = await FundingBudget.create({
            budgetTitle: fundingBudgetData.budgetTitle,
            fundingBudgetDescription: fundingBudgetData.fundingBudgetDescription,
            totalBudget: fundingBudgetData.totalBudget,
            startDate: fundingBudgetData.startDate,
            endDate: fundingBudgetData.endDate,
        });
        return res.status(201).json(newBudget);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error creating budget", error});
    }
}

export const getAllBudgets = async (req, res) => {
    try {
        if (req.requesterUser.roleId !== 1) {
            return res.status(403).json({ message: "Access denied: Only executives can view budgets." });
        }
        const limit = Math.max(parseInt(req.query.limit) || 10, 1); // Ensuring minimum limit of 1
        const page = Math.max(parseInt(req.query.page) || 1, 1); // Ensuring minimum page of 1
        const offset = (page - 1) * limit;
        let conditions = {};
        if (req.query.status) {
            conditions = { status: req.query.status };
        }
        const budgets = await FundingBudget.findAndCountAll({
            where: conditions,
            limit: limit,
            offset: offset,
        });
        return res.status(200).json({
            totalBudgets: budgets.count,
            totalPages: Math.ceil(budgets.count / limit),
            currentPage: page,
            budgets: budgets.rows,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error getting budgets", error });
    }
}

export const getBudgetById = async (req, res) => {
    try {
        if (req.requesterUser.roleId !== 1) {
            return res.status(403).json({ message: "Access denied: Only executives can view budgets." });
        }
        const budgetId = req.params.budgetId;
        const budget = await FundingBudget.findOne({
            where: { id: budgetId },
        });
        if (!budget) {
            res.status(400).json({ message: "Budget not found" });
            return;
        }
        return res.status(200).json(budget);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error getting budget", error });
    }
}

export const getAllFundingRequestsByBudgetId = async (req, res) => {
    try {
        const budgetId = req.params.budgetId;
        const limit = Math.max(parseInt(req.query.limit) || 10, 1); // Ensuring minimum limit of 1
        const page = Math.max(parseInt(req.query.page) || 1, 1); // Ensuring minimum page of 1
        const offset = (page - 1) * limit;
        let conditions = {};
        if (req.query.status) {
            conditions = { ...conditions, status: req.query.status };
        }
        if (req.query.financingType) {
            conditions = { ...conditions, participationType: req.query.participationType };
        }
        const fundingRequests = await FundingRequest.findAndCountAll({
            where: { fundingBudgetId: budgetId, ...conditions },
            limit: limit,
            offset: offset,
            include: [
                {
                    model: User,
                    as: 'applicant',
                    attributes: ['id', 'fullName'],
                },
                {
                    model: FundingRequestFiles,
                    as: 'files',
                    attributes: ['id', 'fileName', 'fileType'],
                },
            ],
        });
        return res.status(200).json(fundingRequests);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error getting funding requests", error });
    }
}

export const updateBudget = async (req, res) => {
    try {
        if (req.requesterUser.roleId !== 1) {
            return res.status(403).json({ message: "Access denied: Only executives can update budgets." });
        }
        const budgetId = req.params.id;
        const budgetData = req.body;
        if (budgetData.totalBudget < budgetData.usedBudget) {
            return res.status(400).json({ message: "The new total budget is less than the used budget" });
        }

        const budget = await FundingBudget.findOne({
            where: { id: budgetId },
        });
        if (!budget) {
            res.status(400).json({ message: "Budget not found" });
            return;
        }
        await budget.update(budgetData);
        return res.status(200).json(budget);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error updating budget", error });
    }
}

export const deleteBudget = async (req, res) => {
    try {
        if (req.requesterUser.roleId !== 1) {
            return res.status(403).json({ message: "Access denied: Only executives can delete budgets." });
        }
        const budgetId = req.params.budgetId;
        const budget = await FundingBudget.findOne({
            where: { id: budgetId },
        });
        if (!budget) {
            res.status(400).json({ message: "Budget not found" });
            return;
        }
        await budget.destroy();
        return res.status(204).json();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error deleting budget", error });
    }
}

export default {
    createFundingBudget,
    getAllBudgets,
    getBudgetById,
    //getAllBudgetsByStatus,
    updateBudget,
    deleteBudget,
    getAllFundingRequestsByBudgetId,
};