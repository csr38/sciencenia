import { capitalizeEachWord, Researcher } from '../db/models/researcher';
import { Op } from 'sequelize';
import * as XLSX from 'xlsx';
import fileController from './fileController';
import path from 'path';

interface ResearchFilters {
  researchLines?: string[];
}

export const createResearcher = async (req, res) => {
  try {
    if (req.requesterUser.roleId !== 1) {
      return res.status(403).json({ error: 'Unauthorized: Only executives can create researchers' });
    }

    const researcherData = req.body;
    console.log(researcherData);
    const newResearcher = await Researcher.create({
      names: researcherData.names,
      lastName: researcherData.lastName,
      secondLastName: researcherData.secondLastName,
      nationality: researcherData.nationality,
      rut: researcherData.rut,
      email: researcherData.email,
      phone: researcherData.phone,
      charge: researcherData.charge,
      researchLines: researcherData.researchLines,
      highestTitle: researcherData.highestTitle,
      highestDegree: researcherData.highestDegree
    });

    return res.status(201).json(newResearcher);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error creating researcher" });
  }
};

export const getAllResearchers = async (req, res) => {
  try {

    //ordenar por id
    const researchers = await Researcher.findAll();
    researchers.sort((a, b) => a.id - b.id);  
    
    return res.status(200).json(researchers);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error getting all researchers" });
  }
};

export const getResearcher = async (req, res) => {
  try {
    const researcherEmail = req.params.email;
    const researcher = await Researcher.findOne({
      where: {
        email: researcherEmail
      }
    });
    if (!researcher) {
      return res.status(404).json({ message: "Researcher not found" });
    }

    return res.status(200).json(researcher);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error getting researcher by id" });
  }
}

export const deleteResearcher = async (req, res) => {
  try {
    if (req.requesterUser.roleId !== 1) {
      return res.status(403).json({ error: 'Unauthorized: Only executives can delete researchers' });
    }

    const researcherEmail = req.params.email;

    const researcher = await Researcher.findOne({
      where: {
        email: researcherEmail
      }
    });

    if (!researcher) {
      return res.status(404).json({ message: "Researcher not found" });
    }

    await Researcher.destroy({
      where: {
        email: researcherEmail
      }
    });

    return res.status(200).json({ message: "Researcher deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error deleting researcher" });
  }
}

export const deleteAllResearchers = async (req, res) => {
  try {
    if (req.requesterUser.roleId !== 1) {
      return res.status(403).json({ error: 'Unauthorized: Only executives can delete all researchers' });
    }
    await Researcher.destroy({
      where: {}
    });
    return res.status(200).json({ message: "All researchers deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error deleting all researchers" });
  }
}

export const updateResearcher = async (req, res) => {
  try {
    if (req.requesterUser.roleId !== 1) {
      return res.status(403).json({ error: 'Unauthorized: Only executives can update researchers' });
    }
    const researcherEmail = req.params.email;
    const researcherData = req.body;

    const researcher = await Researcher.findOne({
      where: {
        email: researcherEmail.toLowerCase()
      }
    });

    if (!researcher) {
      return res.status(404).json({ message: "Researcher not found" });
    }

    await Researcher.update({
      names: researcherData.names,
      lastName: researcherData.lastName,
      secondLastName: researcherData.secondLastName,
      nationality: researcherData.nationality,
      rut: researcherData.rut,
      email: researcherData.email,
      phone: researcherData.phone,
      charge: researcherData.charge,
      researchLines: researcherData.researchLines,
      highestTitle: researcherData.highestTitle,
      highestDegree: researcherData.highestDegree
    }, {
      where: {
        email: researcherEmail
      }
    });

    return res.status(200).json({ message: "Researcher updated" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error updating researcher" });
  }
}

export const getResearchersbyResearchLine = async (req, res) => {

  try {
    const { researchLines }: ResearchFilters = req.body;

    if (!researchLines || researchLines.length === 0) {
      const researchers = await Researcher.findAll();
      return res.status(200).json(researchers);
    }

    const researchers = await Researcher.findAll({
      where: {
        [Op.and]: researchLines.map((line) => ({
          researchLines: { [Op.iLike]: `%${line.trim()}%` },
        })),
      },
    });

    return res.status(200).json(researchers);
  } catch (error) {
    console.error("Error fetching researchers:", error);
    return res.status(500).json({
      message: "Error getting researchers by research line",
      error: error.message,
    });
  }
};


export const getResearcherWithClosestName = async (name: string, similarityThreshold = 0.3) => {
  const [result] = await Researcher.sequelize.query(`
    SELECT *, similarity(COALESCE("names", '') || COALESCE(' ' || "lastName", ''), $name) AS similarity
    FROM "Researchers"
    ORDER BY similarity DESC
    LIMIT 1
  `, {
    bind: { name: capitalizeEachWord(name) }
  });
  const researcher = result[0] as unknown as { similarity: number, id: number };
  if (researcher.similarity < similarityThreshold) {
    return null;
  }
  return await Researcher.findByPk(researcher.id);
}

export const getResearcherWithClosestFullName = async (name: string, similarityThreshold = 0.3) => {
  const [result] = await Researcher.sequelize.query(`
    SELECT *, similarity(COALESCE("names", '') || COALESCE(' ' || "lastName", '') || COALESCE(' ' || "secondLastName", ''), $name) AS similarity
    FROM "Researchers"
    ORDER BY similarity DESC
    LIMIT 1
  `, {
    bind: { name: capitalizeEachWord(name) }
  });
  const researcher = result[0] as unknown as { similarity: number, id: number };
  if (researcher.similarity < similarityThreshold) {
    return null;
  }
  return await Researcher.findByPk(researcher.id);
}

export const addPictureToResearcher = async (req, res) => {
  try {
    if (req.requesterUser.roleId !== 1) {
      return res.status(403).json({ error: 'Unauthorized: Only executives can add pictures researchers' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    let researcher;
    if(req.params.email !== "name"){
      researcher = await Researcher.findOne({where: {email: req.params.email}});
    }else{
      const name = path.parse(req.file.originalname).name;
      researcher = await getResearcherWithClosestFullName(name);
    }
    
    if(!researcher){
      return res.status(404).json({ message: `Researcher not found` });
    }

    const picture = await fileController.createFile(req.file);

    await researcher.update({
      fileId: picture.id
    });

    return res.status(200).json({ message: "Picture added to researcher" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error adding picture to researcher" });
  }
}

const populateResearchersFromExcel = async (sheet: XLSX.WorkSheet): Promise<[number, number, unknown[]]> => {
  const data = XLSX.utils.sheet_to_json(sheet);
  let cntCreated = 0;
  let cntUpdated = 0;
  const rowErrors: unknown[] = [];

  const promises = data.map(async (row) => {
    try {
      if (row['State'] !== 'Active'){
        return;
      }

      const [, created] = await Researcher.upsert(
        {
          names: row['Names'],
          lastName: row['Last Name'],
          secondLastName: row['Second Last Name'],
          nationality: row['Nationality'],
          rut: row['RUT'],
          email: row['Email'].toLowerCase(),
          phone: row['Phone'],
          charge: row['Charge or Position'],
          researchLines: row['Research Lines'],
          highestTitle: row['Highest Title'],
          highestDegree: row['Highest Degree'],
        },
        {
          conflictFields: ['email'],
        }
      );

      if (created) {
        cntCreated++;
      } else {
        cntUpdated++;
      }
    } catch (error) {
      rowErrors.push({ row, message: error.message });
    }
  });

  await Promise.all(promises);

  console.log('Data successfully populated or updated from Excel.');
  return [cntCreated, cntUpdated, rowErrors];
};

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        message: 'No file uploaded',
        userMessage: 'Archivo no encontrado' 
      });
    }
    if (!req.file.originalname.match(/\.(xls|xlsx|csv)$/)) {
      return res.status(400).json({
        message: 'Invalid file type',
        userMessage: `Tipo de archivo inválido '${req.file.originalname}'. Debe ser un archivo de tipo .xls, .xlsx o .csv.`
      });
    }
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    if(workbook.SheetNames.length !== 1) {
      return res.status(400).json({
        message: 'File must contain only one sheet',
        userMessage: `El archivo debe contener solo una hoja. Se encontraron ${workbook.SheetNames.length}.`
      });
    }
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const requiredHeaders = ['Names', 'Last Name', 'Second Last Name', 'Nationality', 'RUT', 'Email', 'Phone', 'Charge or Position', 'Research Lines', 'Highest Title', 'Highest Degree', 'State']
    const sheetHeaders = XLSX.utils.sheet_to_json(sheet, { header: 1 })[0] as unknown[];
    const missingHeaders = requiredHeaders.filter(header => !sheetHeaders.includes(header));
    if (missingHeaders.length > 0) {
      return res.status(400).json({
        message: 'Missing required headers',
        userMessage: `Faltan encabezados requeridos: ${missingHeaders.join(", ")}`
      });
    }

    const [cntCreated, cntUpdated, rowErrors] = await populateResearchersFromExcel(sheet);

    res.status(200).json({ 
      message: `Uploaded ${cntCreated} new researchers and updated ${cntUpdated} existing researchers.${rowErrors.length > 0 ? ` Errors in ${rowErrors.length} rows.` : ''}`,
      userMessage: `Se cargaron ${cntCreated} nuevos investigadores y se actualizaron ${cntUpdated} investigadores existentes.${rowErrors.length > 0 ? ` Errores en ${rowErrors.length} filas.` : ''}`,
      rowErrors: rowErrors
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: `Error uploading file: ${error.message}`, 
      userMessage: "Error al cargar el archivo",
    });
  }
};

export default {
    createResearcher,
    getAllResearchers,
    getResearcher,
    deleteResearcher,
    deleteAllResearchers,
    updateResearcher,
    addPictureToResearcher,
    getResearchersbyResearchLine,
    uploadFile
}