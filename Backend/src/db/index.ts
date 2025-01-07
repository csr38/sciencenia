import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";
import { ApplicationPeriod } from "./models/applicationPeriod";
import { FundingRequest } from "./models/fundingRequest";
import { Research } from "./models/research";
import { Scholarship } from "./models/scholarship";
import { Thesis } from "./models/thesis";
import { User } from "./models/user";
import { UserResearch } from "./models/userResearch";
import { Researcher } from "./models/researcher";
import { UserResearcher } from "./models/userResearcher";
import { File } from "./models/file";
import { FundingRequestFiles } from "./models/fundingRequestFiles";
import { ScholarshipFiles } from "./models/scholarshipFiles";
import { Announcement } from "./models/announcement";
import { UserAnnouncement } from "./models/userAnnouncement";
import { Umzug, SequelizeStorage } from 'umzug';
import path from 'path';
import { seedDatabase } from "./seed";
import { Resource } from "sst";
import { syncWithAuth0 } from "middleware/auth";
import { FundingBudget } from "./models/fundingBudget";

dotenv.config();


/*
 * This module handles database connections.
 * This currently supports three environments:
 * - Local: Uses typical environment variables (DATABASE_USER, DATABASE_PASSWORD, etc.)
 * - RDS: Uses RDS environment variables (RDS_HOSTNAME, RDS_USERNAME, etc.)
 * - SST: Uses injected SST environment variables (Resource.DB)
 * It is assumed that the target database is PostgreSQL.
 */

let user;
let password;
let name;
let host;
let port;
const hasRDSEnv = !!process.env.RDS_HOSTNAME;

try{
  interface Infrastructure {
    ScienceniaDB?: {
      username?: string;
      password?: string;
      database?: string;
      host?: string;
      port?: number;
    };
  }
  const infrastructure = Resource as Infrastructure;
  user = infrastructure.ScienceniaDB.username;
  password = infrastructure.ScienceniaDB.password;
  name = infrastructure.ScienceniaDB.database;
  host = infrastructure.ScienceniaDB.host
  port = infrastructure.ScienceniaDB.port;
} catch {
  if(hasRDSEnv){
    user = process.env.RDS_USERNAME;
    password = process.env.RDS_PASSWORD;
    name = process.env.RDS_DB_NAME;
    host = process.env.RDS_HOSTNAME;
    port = Number(process.env.RDS_PORT);
  }else{
    user = process.env.DATABASE_USER || "db"; 
    password = process.env.DATABASE_PASSWORD || "db";
    name = process.env.DATABASE_NAME || "db";
    host = process.env.DATABASE_HOST || "localhost";
    port = Number(process.env.DATABASE_PORT) || 5432;
  }
}

// Load the RDS CA certificate if needed
// This allows SSL connections to the RDS database
const rdsCa: string = hasRDSEnv
  ? await Bun.file(
      "/usr/local/share/ca-certificates/aws-rds/rds-combined-ca-bundle.pem"
    ).text()
  : null;

console.log(
  `🔌 Connecting to DB at ${user}@${host}:${port}/${name} (${
    hasRDSEnv ? "RDS" : "local"
  })`
);

const sequelize = new Sequelize({
  username: user,
  password: password,
  database: name,
  host: host,
  port: port,
  dialect: "postgres",
  dialectOptions: {
    ssl: hasRDSEnv && {
      require: true,
      rejectUnauthorized: true,
      ca: rdsCa ? [rdsCa] : null,
    },
  },
  models: [
    ApplicationPeriod,
    FundingBudget,
    FundingRequest,
    Research,
    Scholarship,
    Thesis,
    User,
    UserResearch,
    Researcher,
    UserResearcher,
    File,
    FundingRequestFiles,
    ScholarshipFiles,
    Announcement,
    UserAnnouncement,
  ],
});

const connectWithRetry = async (attempts = 20, delay = 10000) => {
  for (let i = 0; i < attempts; i++) {
    try {
      await sequelize.authenticate();
      console.log('Conexión a la base de datos exitosa.');
      return true;
    } catch (error) {
      console.error(`Intento ${i + 1} de ${attempts} fallido:`, error);
      if (i < attempts - 1) {
        console.log(`Reintentando en ${delay / 1000} segundos...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
  throw new Error('No se pudo conectar a la base de datos después de varios intentos.');
};
await connectWithRetry();

console.log(
  `📁 Loaded models: ${sequelize.modelManager.models
    .map((m) => m.name)
    .join(", ")}`
);

// Check for pending migrations
const umzug = new Umzug({
  migrations: {
    glob: path.join(__dirname, './migrations/*.ts'),
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize, modelName: 'sequelize_migrations' }),
  logger: console,
});
const pendingMigrations = await umzug.pending();
if (pendingMigrations.length > 0) {
  throw new Error('There are pending migrations. Please run the migrations before starting the application.');
}

// Seed the database
try{
  await seedDatabase();
}catch(error){
  console.error('Error seeding the database:', error);
}

// Sync users with Auth0
await syncWithAuth0();

export default sequelize;
