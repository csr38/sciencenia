import { Scholarship } from '../db/models/scholarship';
import { User } from '../db/models/user';
import { ApplicationPeriod } from '../db/models/applicationPeriod';
import { Thesis } from 'db/models/thesis';
import { ValidationError } from 'sequelize';
import { ScholarshipFiles } from '../db/models/scholarshipFiles';
import fileController from './fileController';
import { sendPushNotification } from 'notifications';
import mailerController from './mailerController';


const check = async (studentId: number) => {
    const student = await User.findOne({ where: { id: studentId } });
    if (!student) {
        return { valid: false, message: 'User not found' };
    }

    // Function to check empty fields
    const checkEmptyFields = (obj, fields) => {
        return fields.filter(field => !obj[field]).map(field => field.replace(/([A-Z])/g, ' $1').trim());
    };

    // Check empty fields of the user
    const emptyUserFields = checkEmptyFields(student, ['rut', 'phoneNumber', 'academicDegree', 'institution', 'researchLines']);
    if (emptyUserFields.length) {
        return { valid: false, message: `User has empty fields: ${emptyUserFields.join(', ')}` };
    }

    const thesis = await Thesis.findOne({ where: { userId: studentId } });
    if (!thesis) {
        return { valid: false, message: 'User has no thesis' };
    }

    // Check empty fields of the thesis
    const emptyThesisFields = checkEmptyFields(thesis, ['status', 'startDate', 'endDate']);
    if (emptyThesisFields.length) {
        console.log("Empty fields:", emptyThesisFields);
        return { valid: false, message: `Thesis has empty fields: ${emptyThesisFields.join(', ')}` };
    }

    return { valid: true, message: 'User and thesis have all required fields' };
};

export const checkProfileAndThesis = async (req, res) => {
    const result = await check(req.params.id);
    const userRequester = req.requesterUser;
    if (userRequester.roleId !== 1 && userRequester.id !== req.params.id) {
        return res.status(403).json({ message: 'Access denied' });
    }
    if (result.valid) {
        return res.status(200).json({ message: result.message });
    } else {
        return res.status(400).json({ message: result.message });
    }
};



export const createScholarship = async (req, res) => {
    try {
        const scholarshipData = req.body;
        if (!scholarshipData.applicationPeriodId) {
            return res.status(400).json({ message: 'Se requiere indicar el Id del periodo de postulación' });
        }
        const student = req.requesterUser;
        const newcheck = await check(student.id);
        if (!newcheck.valid) {
            return res.status(400).json({ message: newcheck.message });
        }

        const applicationPeriodId = scholarshipData.applicationPeriodId;
        const applicationPeriod = await ApplicationPeriod.findOne({ where: { id: applicationPeriodId } });
        if (!applicationPeriod) {
            return res.status(400).json({ message: 'Periodo de postulación no encontrado' });
        }

        const prevScholarship = await Scholarship.findOne({ where: { studentId: student.id, applicationPeriodId: applicationPeriod.id } });
        if (prevScholarship) {
            return res.status(400).json({ message: 'Ya existe una solicitud de beca para este periodo de postulación' });
        }

        const scholarship = await Scholarship.create({
            studentId: student.id,
            applicationPeriodId: applicationPeriod.id,
            graduationDate: scholarshipData.graduationDate,
            scientificProduction: scholarshipData.scientificProduction,
            otherCentersAffiliation: scholarshipData.otherCentersAffiliation,
            otherProgramsFunding: scholarshipData.otherProgramsFunding,
            anidScholarshipApplication: scholarshipData.anidScholarshipApplication,
            nonAnidScholarshipJustification: scholarshipData.nonAnidScholarshipJustification,
            ceniaParticipationActivities: scholarshipData.ceniaParticipationActivities,
            bankName: scholarshipData.bankName,
            bankAccountType: scholarshipData.bankAccountType,
            bankAccountNumber: scholarshipData.bankAccountNumber,
            amountRequested: scholarshipData.amountRequested,
        });

        if (req.files) {
            await Promise.all(req.files.map(async (file) => {
                const newFile = await fileController.createFile(file);
                await scholarship.$add('files', newFile);
            }));
        } else {
            console.log("No files attached to request");
        }

        return res.status(201).json(scholarship);
    } catch (error) {
        if (error instanceof ValidationError) {
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
        return res.status(500).json({ message: 'Internal server error', error });
    }
};

export const getAllScholarship = async (req, res) => {
    try {
        const userRequester = req.requesterUser;

        const limit = Math.max(parseInt(req.query.limit) || 10, 1); // Ensuring minimum limit of 1
        const page = Math.max(parseInt(req.query.page) || 1, 1); // Ensuring minimum page of 1
        const offset = (page - 1) * limit;
        let conditions = {};
        const { status, student, applicationPeriodId } = req.query;
        if (userRequester && userRequester.roleId !== 1) {
            conditions = { ...conditions, studentId: userRequester.id };
        }
        if (status) {
            conditions = { ...conditions, status };
        }
        if (student) {
            const user = await User.findOne({ where: { email: student } });
            const studentId = user ? user.id : 0;
            conditions = { ...conditions, studentId };
        }
        if (applicationPeriodId) {
            conditions = { ...conditions, applicationPeriodId };
        }

        const scholarship = await Scholarship.findAndCountAll({
            where: conditions,
            limit: limit,
            offset: offset,
        });

        return res.status(200).json({
            total: scholarship.count,
            pages: Math.ceil(scholarship.count / limit),
            currentPage: page,
            data: scholarship.rows,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error getting scholarships", error });
    }
};

export const getScolarshipById = async (req, res) => {
    try {
        const id = req.params.id;
        const scholarship = await Scholarship.findByPk(id);
        if (!scholarship) {
            res.status(400).json({ message: "Scholarship not found" });
            return;
        };
        const userRequester = req.requesterUser;
        if (userRequester.roleId !== 1 && scholarship.studentId !== userRequester.id) {
            res.status(403).json({ message: 'Access denied: You cannot see the scholarship of another student' });
            return;
        }

        res.status(200).json(scholarship);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error getting scholarship", error });
    }

};

export const deleteScholarship = async (req, res) => {
    try {
        const idScholarship = req.params.id
        const scholarship = await Scholarship.findOne({ where: { id: idScholarship } });
        const userRequester = req.requesterUser;
        if (userRequester.roleId !== 1 && userRequester.id !== scholarship.studentId) {
            return res.status(403).json({ message: 'Access denied' });
        }
        console.log("Scholarship:", scholarship);
        if (!scholarship) {
            res.status(400).json({ message: "Scholarship not found" });
            return;
        }
        if (scholarship.status === 'Aprobada') {
            res.status(400).json({ message: "Scholarship already approved" });
            return;
        }
        await Scholarship.destroy({
            where: {
                id: idScholarship,
            }
        });
        res.status(200).json({ message: "Scholarship removed" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error deleting Scholarship", error });
    }
};

function getAcademicDegreeType(grade) {
    if (grade.includes('Doctorado')) {
        return 'Doctorate';
    }
    else if (grade.includes('Magister')) {
        return 'MasterDegree';
    }
    else {
        return 'BachelorDegree';
    }
}

export const patchScholarship = async (req, res) => {
    try {
        const scholarshipId = req.params.id;
        const scholarship = await Scholarship.findOne({ where: { id: scholarshipId } });
        const userRequester = req.requesterUser;
        if (userRequester.roleId !== 1 && userRequester.id !== scholarship.studentId) {
            return res.status(403).json({ message: 'Acceso denegado: No estás autorizado para actualizar una solicitud de otro usuario.' });
        }
        if (!scholarship) {
            return res.status(400).json({ message: "Solicitud de beca no existente" });
        }
        // if (scholarship.status === 'Aprobada' || scholarship.status === 'Rechazada') {
        //     res.status(400).json({ message: "Scholarship already approved or rejected" });
        //     return;
        // }
        if (userRequester.roleId !== 1 && (req.body.status || req.body.statusTutor || req.body.tutorResponse || req.body.amountGranted)) {
            return res.status(403).json({ message: "Acceso denegado: solo los ejecutivos pueden cambiar estos campos" });
        }
        if (req.body.status === 'Aprobada' && !req.body.amountGranted && req.body.amountGranted !== 0) {
            return res.status(400).json({ message: "Es necesario otorgar un monto" });
        }
        if (req.body.amountGranted && req.body.amountGranted < 0) {
            return res.status(400).json({ message: "Monto otorgado debe ser mayor a 0" });
        }
        const applicationPeriod = await ApplicationPeriod.findOne({ where: { id: scholarship.applicationPeriodId } });
        const student = await User.findOne({ where: { id: scholarship.studentId } });
        const grade = getAcademicDegreeType(student.academicDegree);
        const usedBudget = applicationPeriod.usedBudget;
        const totalBudget = applicationPeriod.totalBudget;
        const actualAmountGranted = scholarship.amountGranted || 0;
        const diffAmountGranted = (req.body.amountGranted || 0) - actualAmountGranted;  // en caso de querer actualizar el monto otorgado
        const availableBudget = totalBudget[grade] - usedBudget[grade] + actualAmountGranted;
        if (usedBudget[grade] + diffAmountGranted > totalBudget[grade]) {
            return res.status(400).json({ message: `Presupuesto insuficiente para estudiantes de ${grade}. Presupuesto disponible: ${availableBudget}` });
        }
        if (req.body.status === 'Aprobada') {
            await applicationPeriod.update({ usedBudget: { ...usedBudget, [grade]: usedBudget[grade] + diffAmountGranted } });
        }
        const [rowsAffected, [updatedScholarship]] = await Scholarship.update(req.body, {
            where: {
                id: scholarshipId
            },
            returning: true
        });
        if (rowsAffected === 0 || !updatedScholarship) {
            return res.status(400).json({ message: "La beca no existe o no se han realizado cambios" });
        }

        // Send notification to user
        if (req.body.status === "Aprobada" || req.body.status === "Rechazada") {
            const user = await User.findOne({ where: { id: updatedScholarship.studentId } });
            if (user.firebaseToken) {
                const title = "Solicitud de beca actualizada";
                const body = `El estado de tu solicitud de beca ha cambiado a ${req.body.status}.`;
                sendPushNotification(user.firebaseToken, title, body);
                await mailerController.sendRequestResponse(user.email);
            }
        }

        res.status(200).json(updatedScholarship);
    } catch (error) {
        if (error instanceof ValidationError) {
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
        return res.status(500).json({ message: "Error al actualizar la solicitud de beca", error });
    }
};

export const attachFilesToScholarship = async (req, res) => {
    try {
        const { id } = req.params;
        const scholarship = await Scholarship.findByPk(id);

        if (!scholarship) {
            return res.status(404).json({ message: 'Scholarship not found' });
        }

        if(!req.files || req.files.length <= 0){
            return res.status(400).json({ message: 'No files received' });
        }
          
        const attachedFiles = [];
            await Promise.all(req.files.map(async (file) => {
            const newFile = await fileController.createFile(file);
            await scholarship.$add('files', newFile);
            attachedFiles.push(newFile);
        }));
    
        return res.status(201).json({ message: 'Files attached to scholarship successfully', files: attachedFiles });
    } catch (error) {
        console.error('Error attaching file to scholarship:', error);
        return res.status(500).json({ message: 'Internal server error', error });
    }
};

export const removeFileFromScholarship = async (req, res) => {
    try {
        const { id, fileId } = req.params;

        if (!id || !fileId) {
            return res.status(400).json({ message: 'Scholarship ID and file ID are required' });
        }

        const result = await ScholarshipFiles.destroy({ where: { scholarshipId: id, fileId } });

        if (result === 0) {
            return res.status(404).json({ message: 'File not found in scholarship' });
        }

        res.status(200).json({ message: 'File removed from scholarship successfully' });
    } catch (error) {
        console.error('Error removing file from scholarship:', error);
        return res.status(500).json({ message: 'Internal server error', error });
    }
};


export default {
    createScholarship,
    getAllScholarship,
    checkProfileAndThesis,
    getScolarshipById,
    patchScholarship,
    deleteScholarship,
    attachFilesToScholarship,
    removeFileFromScholarship
};
