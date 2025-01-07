import { User } from '../db/models/user';
import * as XLSX from 'xlsx';
import dotenv from 'dotenv';
import axios from 'axios';
import FormData from 'form-data';
import stream from 'stream';
import { Researcher } from 'db/models/researcher';
import { Thesis } from 'db/models/thesis';
import { UserResearcher } from 'db/models/userResearcher';
import { createHash } from 'crypto';
import { getResearcherWithClosestName } from './researcherController';
import { sendNewAccountEmail } from './mailerController';

dotenv.config();

async function getAuth0ApiToken() {
  const options = {
    method: 'POST',
    url: `${process.env.AUTH0_ISSUER}oauth/token`,
    headers: { 'content-type': 'application/x-www-form-urlencoded', 'Accept-Encoding': 'gzip, deflate' },
    data: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: `${process.env.AUTH0_M2M_CLIENT_ID}`,
      client_secret: `${process.env.AUTH0_M2M_CLIENT_SECRET}`,
      audience: `${process.env.AUTH0_ISSUER}api/v2/`
    })
  };
  const response = await axios.request(options);
  return response.data.access_token;
}

async function getConnectionId(connectionName, token) {
  try {
    const response = await axios.get(`${process.env.AUTH0_ISSUER}api/v2/connections`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { name: connectionName }
    });
    const connection = response.data.find(conn => conn.name === connectionName);
    if (!connection) {
      throw new Error(`Connection "${connectionName}" not found.`);
    }
    return connection.id;
  } catch (error) {
    console.error(`Error fetching connection ID for "${connectionName}":`, error.response?.data || error.message);
    throw error;
  }
}

async function createBulkImportJobAuth0(users) {
  try {
    const token = await getAuth0ApiToken();
    const connectionName = "Username-Password-Authentication";
    const connectionId = await getConnectionId(connectionName, token);

    const jsonData = JSON.stringify(users);

    const jsonStream = new stream.Readable();
    jsonStream.push(jsonData);
    jsonStream.push(null);

    const form = new FormData();
    form.append('users', jsonStream, { filename: 'users.json', contentType: 'application/json' });
    form.append('connection_id', connectionId);
    form.append('upsert', 'false');
    form.append('send_completion_email', 'false');

    const response = await axios.post(
      `${process.env.AUTH0_ISSUER}api/v2/jobs/users-imports`,
      form,
      { headers: { Authorization: `Bearer ${token}`, ...form.getHeaders() } }
    );
    console.log('Bulk import job created:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating bulk import job:', error.response?.data || error.message);
    throw error;
  }
}

function getMD4Hash(password) {
  const hash = createHash('md4');
  hash.update(password);
  return hash.digest('hex');
}

async function createUsersInAuth0(users) {
  try {
    const userDataJson = [];
    for (const user of users) {
      const rut = user['rut'].replace('-', '').replaceAll('.', '');
      const password_hash = getMD4Hash(rut.slice(4, 9));
      const userJson = {
        email: user['email'],
        user_metadata: {
          password_change: false,
        },
        email_verified: true,
        custom_password_hash: {
          algorithm: "md4",
          hash: {
            value: password_hash,
            encoding: "hex",
          },
        },
        given_name: user['names'],
        family_name: user['lastName'],
        name: `${user['names']} ${user['lastName']}`,
      };
      userDataJson.push(userJson);
    }  

    const emails = userDataJson.map(user => user.email);
    await sendNewAccountEmail(emails);
    
    return await createBulkImportJobAuth0(userDataJson);
  } catch (error) {
    console.error('Error creating users in Auth0:', error.response?.data || error.message);
    return;
  }
}

function removeAccents(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function filterAttributes(obj, keys) {
  return keys.reduce((filteredObj, key) => {
    if (key in obj) {
      filteredObj[key] = obj[key];
    }
    return filteredObj;
  }, {});
}

function generateUserNames(names, lastname) {
  const randomnumber = Math.floor(Math.random() * 1000);
  const username = `${names.split(' ')[0].toLowerCase()}${lastname.toLowerCase()}${randomnumber}`;
  return username;
}

function cleanHeaders(headers) {
  if (!Array.isArray(headers)) {
    console.error("Error: headers no es un arreglo. Valor recibido:", headers);
    return [];
  }

  for (let i = 0; i < headers.length; i++) {
    headers[i] = headers[i].split(' (')[0].trim();
    headers[i] = headers[i].toLowerCase().replace(/ /g, '_'); // Reemplaza espacios por guiones bajos
    headers[i] = removeAccents(headers[i]);
  }
  const values_to_reeplace = ['nombre', 'apellido_paterno', 'apellido_materno', 'rut_o_pasaporte', 'genero', 'celular', 'correo', 'grado_academico',
    'nombre_completo_del_grado', 'universidad', 'ano_ingreso_cenia', 'rl', 'nombre_tesis', 'estado_tesis', 'mes_y_ano_de_inicio_de_tesis',
    'mes_y_ano_de_termino_de_tesis', 'extension_de_tesis', 'recibe_incentivo_cenia_actualmente'];

  const values_replaced = ['names', 'lastName', 'secondLastName', 'rut', 'gender', 'phoneNumber', 'email', 'academicDegree',
    'fullNameDegree', 'institution', 'entryYear', 'researchLines', 'title', 'status', 'startDate', 'endDate', 'extension',
    'resourcesRequested'];

  headers = headers.map(header => {
    const index = values_to_reeplace.indexOf(header);
    return index !== -1 ? values_replaced[index] : header;
  });

  return headers;
}

async function createThesis(userId, thesisData) {
  const count_words_title = thesisData.title.split(' ').length;
  if (count_words_title < 4 || thesisData.title.match(/(no aplica|no iniciada)/i) !== null) {
    return "El usuario no tiene tesis";
  }
  thesisData.extension = thesisData.extension === 'Si';
  thesisData.startDate = new Date((thesisData.startDate - 25569) * 86400 * 1000);
  thesisData.endDate = new Date((thesisData.endDate - 25569) * 86400 * 1000);
  const thesis = await Thesis.findOrCreate({
    where: { userId: userId },
    defaults: thesisData
  });
  return thesis;
}

async function createTutorsRelation(userId, user) {
  await UserResearcher.destroy({ where: { user_id: userId } });
  let tutorCnt = 0;
  if (user['correo_profesor']) {
    const professorEmails = user['correo_profesor'].split(';').map(email => email.trim());
    for (let i = 0; i < professorEmails.length; i++) {
      const email = professorEmails[i].toLowerCase();
      const role = (i == 0 ? "Tutor Principal" : "Co-Tutor");
      const researcher = await Researcher.findOne({ where: { email } });
      if (researcher) {
        await UserResearcher.create({
          user_id: userId,
          researcher_id: researcher.id,
          tutorRol: role,
        });
        tutorCnt += 1;
      }
    }
  }
  if(tutorCnt === 0 && user['profesor/es_o_investigador/a_cenia']){
    const tutorNames = user['profesor/es_o_investigador/a_cenia'].split(';').map(email => email.trim());
    for (let i = 0; i < tutorNames.length; i++) {
      const name = tutorNames[i];
      const role = (i == 0 ? "Tutor Principal" : "Co-Tutor");
      const researcher = await getResearcherWithClosestName(name, 0.4);
      if (researcher) {
        await UserResearcher.create({
          user_id: userId,
          researcher_id: researcher.id,
          tutorRol: role,
        });
        tutorCnt += 1;
      }
    }
  }
}

async function createUsersInDatabase(users): Promise<[number, number, unknown[]]> {
  let cntCreated = 0;
  let cntUpdated = 0;
  const rowErrors = [];
  const modelKeys = [
    'names', 'lastName', 'secondLastName', 'rut', 'gender', 'phoneNumber', 'email', 'username',
    'academicDegree', 'fullNameDegree', 'institution', 'entryYear', 'researchLines'
  ];
  const thesisKeys = ['title', 'status', 'startDate', 'endDate', 'extension', 'resourcesRequested'];

  const promises = users.map(async (user) => {
    try {
      const userData = filterAttributes(user, modelKeys);
      const thesisData = filterAttributes(user, thesisKeys);

      const existingUser = await User.findOne({ where: { email: userData.email } }) as User | null;
      if (existingUser) {
        await existingUser.update(userData);
        await createThesis(existingUser.id, thesisData);
        await createTutorsRelation(existingUser.id, user);
        cntUpdated += 1;
      }
      else {
        const new_user = await User.create(userData);
        await createThesis(new_user.id, thesisData);
        await createTutorsRelation(new_user.id, user);
        cntCreated += 1;
      }
    } catch (error) {
      console.error(`Error processing user ${user.email}:`, error);
      rowErrors.push({ email: user.email, error: error.message });
    }
  });

  await Promise.all(promises);

  return [cntCreated, cntUpdated, rowErrors];
}

const populateUsers = async (sheet: XLSX.WorkSheet): Promise<[number, number, unknown[], unknown]> => {
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1, range: 1, blankrows: false, defval: '-' });
  const headers = cleanHeaders(data[0]);
  const datausers = data.slice(1);
  const users = [];

  for (const user of datausers) {
    const userObj = {};
    for (let i = 0; i < headers.length; i++) {
      userObj[headers[i]] = user[i];
    }
    userObj['username'] = generateUserNames(userObj['names'], userObj['lastName']);
    userObj['researchLines'] = userObj['researchLines'].match(/RL \d+ - [^R]*/g) || [];
    userObj['resourcesRequested'] = ['Si', 'Sí'].includes(userObj['resourcesRequested']);
    users.push(userObj);
  }

  const [bulkImportJob, [cntCreated, cntUpdated, rowErrors]] = await Promise.all([
    createUsersInAuth0(users),
    createUsersInDatabase(users)
  ]);

  return [cntCreated, cntUpdated, rowErrors, bulkImportJob];
}

export const uploadUsers = async (req, res) => {
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

    if (workbook.SheetNames.length !== 1) {
      return res.status(400).json({
        message: 'File must contain only one sheet',
        userMessage: `El archivo debe contener solo una hoja. Se encontraron ${workbook.SheetNames.length}.`
      });
    }

    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const requiredHeaders = ["Nombre", "Apellido Paterno", "Apellido Materno", "Rut o pasaporte", "Género", "Celular (Whatsapp)", "Correo", "Grado Académico (Academic Degree)", "Nombre Completo del Grado (Full name of the Degree)", "Universidad", "Año ingreso Cenia", "RL (Línea de Investigación)"];
    const sheetHeaders = XLSX.utils.sheet_to_json(sheet, { range: 1, header: 1, blankrows: false, defval: '-' })[0] as unknown[];
    const missingHeaders = requiredHeaders.filter(header => !sheetHeaders.includes(header));

    if (missingHeaders.length > 0) {
      return res.status(400).json({
        message: 'Missing required headers',
        userMessage: `Faltan encabezados requeridos: ${missingHeaders.join(", ")}`
      });
    }

    const [cntCreated, cntUpdated, rowErrors, bulkImportJob] = await populateUsers(sheet);

    res.status(200).json({
      message: `Uploaded ${cntCreated} new students and updated ${cntUpdated} existing students.${rowErrors.length > 0 ? ` Errors in ${rowErrors.length} rows.` : ''}`,
      userMessage: `Se cargaron ${cntCreated} nuevos estudiantes y se actualizaron ${cntUpdated} estudiantes existentes.${rowErrors.length > 0 ? ` Errores en ${rowErrors.length} filas.` : ''}`,
      rowErrors: rowErrors,
      auth0BulkImportJob: bulkImportJob
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
  uploadUsers
}
