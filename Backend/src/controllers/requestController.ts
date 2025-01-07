import { FundingRequest } from '../db/models/fundingRequest';
import { User } from '../db/models/user';
import { FundingRequestFiles } from '../db/models/fundingRequestFiles';
import fileController from './fileController';
import { sendPushNotification } from 'notifications';
import mailerController from './mailerController';
import { FundingBudget } from 'db/models/fundingBudget';

export const createRequest = async (req, res) => {
    try {
        const fundingRequestData = req.body;
        if (fundingRequestData.emailApplicant && req.requesterUser.email !== fundingRequestData.emailApplicant) {
            return res.status(403).json({ message: "Acceso denegado: No estás autorizado para crear una solicitud para otro usuario." });
        }

        // Create the request and associate it with the user
        const fundingRequest = await FundingRequest.create({
            applicantId: req.requesterUser.id,
            purpose: fundingRequestData.purpose,
            otherPurpose: fundingRequestData.otherPurpose,
            tasksToDo: fundingRequestData.tasksToDo,
            resultingWork: fundingRequestData.resultingWork,
            destination: fundingRequestData.destination,
            startDate: fundingRequestData.startDate,
            durationPeriod: fundingRequestData.durationPeriod,
            financingType: fundingRequestData.financingType,
            amountRequested: fundingRequestData.amountRequested,
            otherFinancingType: fundingRequestData.otherFinancingType,
            outsideFinancing: fundingRequestData.outsideFinancing,
            outsideFinancingSponsors: fundingRequestData.outsideFinancingSponsors,
            conferenceName: fundingRequestData.conferenceName,
            conferenceRanking: fundingRequestData.conferenceRanking,
            researchName: fundingRequestData.researchName,
            researchAbstract: fundingRequestData.researchAbstract,
            acknowledgment: fundingRequestData.acknowledgment,
            acknowledgmentProof: fundingRequestData.acknowledgmentProof,
            outsideAcknowledgment: fundingRequestData.outsideAcknowledgment,
            outsideAcknowledgmentName: fundingRequestData.outsideAcknowledgmentName,
            participationType: fundingRequestData.participationType,
        });

        if (req.files) {
          console.log("Files attached to request");
            await Promise.all(req.files.map(async (file) => {
                const newFile = await fileController.createFile(file);
                await fundingRequest.$add('files', newFile);
            }));
        } else {
            console.log("No files attached to request");
        }

        return res.status(201).json(fundingRequest);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', error});
    }
};

export const getAllRequest = async (req, res) => {
    try {
        const user = req.requesterUser;
        if (user.roleId !== 1) {
            res.status(403).json({ message: "Access denied: Only executives can view all requests" });
            return;
        };
        const limit = Math.max(parseInt(req.query.limit) || 10, 1); // Ensuring minimum limit of 1
        const page = Math.max(parseInt(req.query.page) || 1, 1); // Ensuring minimum page of 1
        const offset = (page - 1) * limit;

        const fundingRrequest = await FundingRequest.findAndCountAll({
            limit: limit,
            offset: offset,
        });

        res.status(200).json({
            total: fundingRrequest.count,
            pages: Math.ceil(fundingRrequest.count / limit),
            currentPage: page,
            data: fundingRrequest.rows,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error getting requests", error});
    }
};

export const getRequestByUser = async (req, res) => {
    try {
        const userEmail = req.params.email;
        const user = await User.findOne({where: {email: userEmail}});
        console.log(" Email:", userEmail);

        // Validate that the user exists
        if (!user) {
            res.status(400).json({ message: "User does not exist" });
            return;
        };
        const requesterUser = req.requesterUser;
        if (requesterUser?.roleId === 2 && requesterUser?.email !== userEmail) {
            return res.status(403).json({ message: "Access denied: You are not authorized to view this user." });
        }

        const request = await FundingRequest.findAll({where: {applicantId: user.id}});

        res.status(200).json(request);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error getting request", error});
    }
};

export const getRequestById = async (req, res) => {
    try {
        const fundingRequest = await FundingRequest.findByPk(req.params.id);
        const requesterUser = req.requesterUser;
        if (requesterUser?.roleId === 2 && requesterUser?.id !== fundingRequest.applicantId) {
            return res.status(403).json({ message: "Access denied: You are not authorized to view this request." });
        }

        // Validate that the request exists
        if (!fundingRequest) {
            res.status(400).json({ message: "Request not found" });
            return;
        };

        res.status(200).json(fundingRequest);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error getting request", error});
    }
};

export const getAllRequestByStatusType = async (req, res) => {
    try {
        if (req.requesterUser.roleId !== 1) {
            res.status(403).json({ message: "Access denied: Only executives can view all requests" });
            return;
        };

        const statusType = req.params.statusType;
        const limit = Math.max(parseInt(req.query.limit) || 10, 1); // Ensuring minimum limit of 1
        const page = Math.max(parseInt(req.query.page) || 1, 1); // Ensuring minimum page of 1
        const offset = (page - 1) * limit;

        const fundingRequests = await FundingRequest.findAndCountAll({
            where: {
                status: statusType,
            },
            limit: limit,
            offset: offset,
        });

        res.status(200).json({
            total: fundingRequests.count,
            pages: Math.ceil(fundingRequests.count / limit),
            currentPage: page,
            data: fundingRequests.rows,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error getting requests" });
    }
};


export const deleteRequest = async (req, res) => {
    try {
      const fundingRequestId= req.params.id
      const fundingRequest= await FundingRequest.findOne({ where: { id: fundingRequestId} });
      console.log("REQUEST:", fundingRequest);
      const requesterUser = req.requesterUser;
      // Validate that the request exists
      if (!fundingRequest) {
        res.status(400).json({ message: "Request not found" });
        return;
      }
      if (requesterUser?.roleId !== 1 && requesterUser?.id !== fundingRequest.applicantId) {
        return res.status(403).json({ message: "Access denied: Only executives can delete all requests." });
      }
      if (requesterUser?.roleId !== 1 && fundingRequest.status === "Aprobada") {
        return res.status(403).json({ message: "Access denied: You can't delete a request that has been approved." });
      }
      // Delete the request
      await FundingRequest.destroy({
        where: {
            id: fundingRequestId,
        }
      });
      
      res.status(200).json({ message: "Request removed" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error deleting request", error});
    }
};

export const patchRequest = async (req, res) => {
    try {
      const fundingRequestId = req.params.id;
      const fundingRequest = await FundingRequest.findByPk(fundingRequestId);
      const requesterUser = req.requesterUser;
      const oldAmountGranted = fundingRequest.amountGranted;
      const newAmountGranted = req.body.amountGranted || oldAmountGranted;
      const diffAmountGranted = newAmountGranted - oldAmountGranted;
      if (requesterUser?.roleId === 2 && requesterUser?.id !== fundingRequest.applicantId) {        
        return res.status(403).json({ message: "Acceso denegado: No estás autorizado para ver esta solicitud." });
      }
      if (requesterUser?.roleId !== 1 && (fundingRequest.status === "Aprobada" || fundingRequest.status === "Rechazada")) {
        return res.status(403).json({ message: "Acceso denegado: No puedes actualizar una solicitud que ya ha sido aprobada o rechazada." });
      }
      if (requesterUser?.roleId !== 1 && req.body.status && (req.body.status !== fundingRequest.status)) {
        return res.status(403).json({ message: "Acceso denegado: Solo los ejecutivos pueden actualizar el estado de la solicitud." });
      }
      if (req.body.amountRequested && req.body.amountRequested < 0) {
        return res.status(400).json({ message: "La cantidad solicitada debe ser un número positivo" });
      }
      const status = req.body.status || fundingRequest.status;
      if(status === "Aprobada"){
        if(newAmountGranted < 0){
          return res.status(400).json({ message: "La cantidad otorgada debe ser un número positivo" });
        }
        const budgetId = req.body.budgetId || fundingRequest.fundingBudgetId;
        if(!budgetId){
          return res.status(400).json({ message: "Se requiere el ID del presupuesto" });
        }
        const fundingBudget = await FundingBudget.findByPk(budgetId);
        if (!fundingBudget) {
          return res.status(400).json({ message: `No existe el presupuesto con ID ${budgetId}` });
        }
        if (fundingBudget.status !== "Activo") {
          return res.status(400).json({ message: "El presupuesto no está activo" });
        }
        if (fundingBudget.usedBudget + diffAmountGranted > fundingBudget.totalBudget) {
          return res.status(400).json({ message: "Se excedió el límite del presupuesto" });
        }
      }
      
      const [rowsAffected, [updatedRequest]] = await FundingRequest.update(req.body, {
        where: {
          id: fundingRequestId
        },
        returning: true 
      });

      // Validate that the request exists and that changes were made
      if (rowsAffected === 0 || !updatedRequest) { 
          res.status(400).json({ message: "La solicitud no existe o no se realizaron cambios" });
          return;
      }
      if (req.body.status === "Aprobada") {
        const budgetId = req.body.budgetId || fundingRequest.fundingBudgetId;
        if(!budgetId){
          return res.status(400).json({ message: "Se requiere el ID del presupuesto" });
        }
        const fundingBudget = await FundingBudget.findByPk(budgetId);
        await fundingBudget.update({usedBudget: fundingBudget.usedBudget + diffAmountGranted,});
      }

      // Send notification to user
      try {
        if (req.body.status === "Aprobada" || req.body.status === "Rechazada") {
        const user = await User.findByPk(updatedRequest.applicantId);
          if (user.firebaseToken && fundingRequest.destination) {
            const title = "Solicitud de financiamiento actualizada";
            const body = `El estado de tu solicitud a ${fundingRequest.destination} ha cambiado a ${req.body.status}.`;
            sendPushNotification(user.firebaseToken, title, body);
            await mailerController.sendRequestResponse(user.email);
          }
          //return res.status(200).json({ message: "Nofication sent and Request Updated", updatedRequest});
        }
      } catch (error) {
        console.log(`Error sending notification: ${error}`);
        //return res.status(502).json({ message: "Error sending notification but Request Updated", error});
      }
      return res.status(200).json({ message: "Solicitud actualizada", request: updatedRequest });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error al actualizar la solicitud", error: error });
    }
};

export const attachFilesToRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const fundingRequest = await FundingRequest.findByPk(id);

    if (!fundingRequest) {
      return res.status(404).json({ message: 'Funding Request not found' });
    }

    if(!req.files || req.files.length <= 0){
      return res.status(400).json({ message: 'No files received' });
    }

    const attachedFiles = [];
    await Promise.all(req.files.map(async (file) => {
      const newFile = await fileController.createFile(file);
      await fundingRequest.$add('files', newFile);
      attachedFiles.push(newFile);
    }));

    return res.status(201).json({ message: 'Files attached to request successfully', files: attachedFiles });
  } catch (error) {
    console.error('Error attaching file to request:', error);
    return res.status(500).json({ message: 'Internal server error', error});
  }
};

export const removeFileFromRequest = async (req, res) => {
  try {
    const { id, fileId } = req.params;

    if (!id || !fileId) {
      return res.status(400).json({ message: 'Funding request ID and file ID are required' });
    }

    const result = await FundingRequestFiles.destroy({ where: { fundingRequestId: id, fileId } });

    if (result === 0) {
      return res.status(404).json({ message: 'File not found in funding request' });
    }

    res.status(200).json({ message: 'File removed from funding request successfully' });
  } catch (error) {
    console.error('Error removing file from request:', error);
    return res.status(500).json({ message: 'Internal server error', error });
  }
};


export default {
    createRequest,
    getAllRequest,
    getRequestByUser,
    getRequestById,
    getAllRequestByStatusType,
    deleteRequest,
    patchRequest,
    attachFilesToRequest,
    removeFileFromRequest,
};
