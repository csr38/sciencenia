import { Umzug, SequelizeStorage } from 'umzug';
import { Sequelize } from 'sequelize';
import { Resource } from "sst";
import path from 'path';

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

const umzug = new Umzug({
  migrations: {
    glob: path.join(__dirname, './migrations/*.ts'),
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize, modelName: 'sequelize_migrations' }),
  logger: console,
});

const runMigrations = async () => {
  try {
    console.log('Ejecutando migraciones...');
    // Check if the sequelize_migrations table exists
    const queryInterface = sequelize.getQueryInterface();
    const allTables = await queryInterface.showAllTables();
    if (!allTables.includes('sequelize_migrations')) {
      console.log('Old database detected. Dropping all tables and running migrations from scratch.');
      // Drop all tables in the database
      await sequelize.drop();
      console.log('All tables have been dropped.');
    }

    await umzug.up();
    console.log('Todas las migraciones se han ejecutado correctamente');
    process.exit(0);
  } catch (error) {
    console.error('Error al ejecutar las migraciones:', error);
    process.exit(1);
  }
};

await runMigrations();