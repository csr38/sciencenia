import { Sequelize } from "sequelize";
import { Research } from "../db/models/research";
import { Op } from 'sequelize';
import * as XLSX from 'xlsx';

export const getResearchById = async (req, res) => {
  try {
    const research = await Research.findByPk(req.params.id);

    if (!research) {
      return res.status(404).json({ message: 'Research not found' });
    }

    return res.status(200).json(research);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error fetching research' });
  }
}

export const searchOnAnyField = async (req, res) => {
  try {
    const searchTerm = req.body.searchTerm;
         
    const similarity = `
      GREATEST(
        similarity($searchTerm, "doi"),
        similarity($searchTerm, "journal"),
        word_similarity($searchTerm, "title"),
        (
          SELECT MAX(similarity(authors_element, $searchTerm)) FROM unnest("authors") AS authors_element
        )
      )
    `;
    const limit = Math.max(parseInt(req.query.limit) || 10, 1);
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const offset = (page - 1) * limit;

    let research;
    if(searchTerm && searchTerm.trim().length > 0) {
      research = await Research.findAndCountAll({
        where: Sequelize.literal(`(${similarity}) > 0.2`),
        limit: limit,
        offset: offset,
        bind: { searchTerm: searchTerm.trim() },
        order: [[Sequelize.literal(similarity), 'DESC']],
        distinct: true,
      });
    }else{
      research = await Research.findAndCountAll({
        limit: limit,
        offset: offset,
        distinct: true,
      });
    }
    if (!research) {
      res.status(400).json({ message: "Research not found" });
      return;
    }
    res.status(200).json({
      total: research.count,
      pages: Math.ceil(research.count / limit),
      currentPage: page,
      data: research.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error getting research" });
  }
};

export const getFilterOptions = async (req, res) => {
  try {
    const indexed = await Research.findAll({
      attributes: [
        [Sequelize.fn('DISTINCT', Sequelize.fn('unnest', Sequelize.col('indexed'))), 'indexed'],
      ],
    });

    const researchLines = await Research.findAll({
      attributes: [
        [Sequelize.fn('DISTINCT', Sequelize.fn('unnest', Sequelize.col('researchLines'))), 'researchLines'],
      ],
    });

    res.status(200).json({
      indexed: indexed.map((i) => i.indexed),
      researchLines: researchLines.map((r) => r.researchLines),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error getting filter options" });
  }
}

interface Filters {
  doi?: string;
  author?: string;
  title?: string;
  journal?: string;
  minYear?: number;
  maxYear?: number;
  indexed?: string[];
  researchLines?: string[];
}

export const search = async (req, res) => {
  try {
    const filters: Filters = req.body.filters;
    console.log("FILTERS:", filters);
     
    const whereClause = { [Op.and]: [] };
    const order = [];
    const bindings: Record<string, unknown> = {};

    // Set the pg_trgm similarity threshold
    await Research.sequelize.query('SET pg_trgm.word_similarity_threshold = 0.1;');
    await Research.sequelize.query('SET pg_trgm.similarity_threshold = 0.2;');

    if (filters) {
      if (filters.doi && filters.doi.length > 0) {
        whereClause[Op.and].push(
          Sequelize.literal(`$doi % "doi"`)
        );
        order.push([Sequelize.fn('similarity', Sequelize.col('doi'), filters.doi), 'DESC']);
        bindings.doi = filters.doi;
      }
      if (filters.author && filters.author.length > 0) {
        whereClause[Op.and].push(
          Sequelize.literal(`$author % ANY("authors")`)
        );
        const maxSimilarity = Sequelize.literal(`(
          SELECT MAX(similarity(authors_element, $author)) FROM unnest("authors") AS authors_element
        )`);
        order.push([maxSimilarity, 'DESC']);
        bindings.author = filters.author;
      }
      if (filters.journal && filters.journal.length > 0) {
        whereClause[Op.and].push(
          Sequelize.literal(`$journal <% "journal"`)
        );
        order.push([Sequelize.fn('similarity', Sequelize.col('journal'), filters.journal), 'DESC']);
        bindings.journal = filters.journal;
      }
      if (filters.title && filters.title.length > 0) {
        whereClause[Op.and].push(
          Sequelize.literal(`$title <% "title"`)
        );
        order.push([Sequelize.fn('similarity', Sequelize.col('title'), filters.title), 'DESC']);
        bindings.title = filters.title;
      }
      if (filters.minYear && filters.minYear > 0) {
        whereClause[Op.and].push({
          yearPublished: { [Op.gte]: filters.minYear }
        });
      }
      if (filters.maxYear && filters.maxYear > 0) {
        whereClause[Op.and].push({
          yearPublished: { [Op.lte]: filters.maxYear }
        });
      }
      if (filters.indexed && filters.indexed.length > 0) {
        whereClause[Op.and].push(
          Sequelize.literal(`"indexed" @> $indexed`)
        );
        bindings.indexed = filters.indexed;
      }
      if (filters.researchLines && filters.researchLines.length > 0) {
        whereClause[Op.and].push(
          Sequelize.literal(`"researchLines" @> $researchLines`)
        );
        bindings.researchLines = filters.researchLines;
      }
    }
    const limit = Math.max(parseInt(req.query.limit) || 10, 1);
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const offset = (page - 1) * limit;

    const research = await Research.findAndCountAll({
      where: whereClause,
      limit: limit,
      offset: offset,
      bind: bindings,
      order: order,
      distinct: true,
    });
    if (!research) {
      res.status(400).json({ message: "Research not found" });
      return;
    }
    res.status(200).json({
      total: research.count,
      pages: Math.ceil(research.count / limit),
      currentPage: page,
      data: research.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error getting research" });
  }
};

export const bulkUpload = async (req, res) => {
  try {
    if(req.requesterUser.roleId !== 1) {
      return res.status(403).json({ message: 'Only executives can upload research data' });
    }

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
    const requiredHeaders = ["ID", "DOI/Identifier", "Authors", "Article Title", "Journal Name", "Volume", "Year Published", "First Page", "Last Page", "Notes", "Indexed/Not Indexed", "Funding", "Name of Research Line", "Progress Report", "Participants of the Center that collaborate in the Article"];
    const sheetHeaders = XLSX.utils.sheet_to_json(sheet, { header: 1 })[0] as unknown[];
    const missingHeaders = requiredHeaders.filter(header => !sheetHeaders.includes(header));
    if (missingHeaders.length > 0) {
      return res.status(400).json({
        message: 'Missing required headers',
        userMessage: `Faltan encabezados requeridos: ${missingHeaders.join(", ")}`
      });
    }

    const data = XLSX.utils.sheet_to_json(sheet);
    const rowErrors = [];

    let cnt = 0;
    const promises = data.map(async (row) => {
      try{
        if (!row["ID"]) {
          throw new Error("ID no encontrado");
        }
        if (row["Year Published"]) {
          try {
            row["Year Published"] = parseInt(row["Year Published"]);
          } catch {
            throw new Error("'Year Published' debe ser un número entero");
          }
        }
        if (row["Progress Report"]) {
          try {
            row["Progress Report"] = parseInt(row["Progress Report"]);
          } catch {
            throw new Error("'Progress Report' debe ser un número entero");
          }
        }
        await Research.upsert({
          id: row["ID"],
          doi: row["DOI/Identifier"],
          authors: row["Authors"]?.split(";").map(author => author.trim()),
          title: row["Article Title"],
          journal: row["Journal Name"],
          volume: row["Volume"],
          yearPublished: row["Year Published"],
          firstPage: row["First Page"],
          lastPage: row["Last Page"],
          notes: row["Notes"],
          indexed: row["Indexed/Not Indexed"]?.split(",").map(index => index.trim()),
          funding: row["Funding"],
          researchLines: row["Name of Research Line"]?.split(";").map(line => line.trim()),
          progressReport: row["Progress Report"],
          ceniaParticipants: row["Participants of the Center that collaborate in the Article"]
            ?.split(";")
            .map(participant => {
              const [name, role] = participant.split("(");
              return { name: name.trim(), role: role.replace(/\)$/, '').trim() };
            }),
          roleParticipations: row["Role Participations"]?.split(";").map(role => role.trim()),
          link: row["Links"],
          anidNotes: row["ANID Notes"]
        });
        cnt++;
      } catch (error) {
        rowErrors.push({ 
          rowNum: row["__rowNum__"], 
          message: error.message 
        });
      }
    });

    await Promise.all(promises);

    res.status(200).json({ 
      message: `Loaded ${cnt} rows successfully.`,
      userMessage: `Se cargaron ${cnt} investigaciones correctamente. ${rowErrors.length > 0 ? `Errores en ${rowErrors.length} filas.` : ''}`,
      rowErrors: rowErrors
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: `Error uploading file: ${error.message}`, 
      userMessage: "Error al cargar el archivo",
    });
  }
}

export default {
  getResearchById,
  getFilterOptions,
  bulkUpload,
  searchOnAnyField,
  search,
};