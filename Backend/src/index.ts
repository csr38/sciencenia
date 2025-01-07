import express, { Express, Request, Response, NextFunction } from 'express';
import cron from 'node-cron';
import { checkExecutivePendingItems } from './controllers/mailerController';
import path from 'path';
import cors from 'cors';
import morgan from 'morgan';
import multer from 'multer';
import sequelize from './db';
import checkJwt from './middleware/auth';
import usersRoutes from './routes/userRoutes';
import researchRoutes from './routes/researchRoutes';
import thesisRoutes from './routes/thesisRoutes';
import requestRoutes from './routes/requestRoutes';
import scholarshipRoutes from './routes/scholarshipRoutes';
import applicationPeriodRoutes from './routes/applicationPeriodRoutes';
import researcherRoutes from './routes/researcherRoutes';
import userResearcherRoutes from './routes/userResearcherRoutes';
import mailerRoutes from './routes/mailerRoutes';
import fileRoutes from 'routes/fileRoutes';
import announcementRoutes from 'routes/announcementRoutes';
import userAnnouncementRoutes from 'routes/userAnnouncementRoutes';
import databaseResetController from 'controllers/databaseResetController';
import fundingBudgetRoutes from 'routes/fundingBudgetRoutes';
import { User } from 'db/models/user';
const app: Express = express();
const PORT: number = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// Middleware to log request body
morgan.token('req-body', (req: Request) => JSON.stringify(req.body, null, 2));
// Middleware to log response body
const logResponseBody = (req: Request, res: Response, next: NextFunction) => {
  const originalSend = res.send;
  res.send = function (...args) {
    console.log('Response Body:');
    console.log(JSON.stringify(JSON.parse(args[0]), null, 2));
    return originalSend.apply(this, args);
  };
  next();
};
// Apply logging middleware only in development mode
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`\n--- New Request ---`);
  console.log(`Request: ${req.method} ${req.url}`);
  console.log('Request Body:');
  console.log(JSON.stringify(req.body, null, 2));
  next();
});
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
app.use(logResponseBody);

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.options('*', cors());

// Routes
app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Welcome.",
    lastDeployTime: process.env.LAST_DEPLOY_TIME || 'Not available'
  });
});

app.get('/api/private', checkJwt, (req: Request, res: Response) => {
  res.json({
    message: 'Hello from a private endpoint! You need to be authenticated to see this.'
  });
});

app.use("/users", usersRoutes);
app.use("/research", researchRoutes);
app.use("/thesis", thesisRoutes);
app.use("/request", requestRoutes);
app.use("/scholarship", scholarshipRoutes);
app.use("/applicationPeriod", applicationPeriodRoutes);
app.use("/researcher", researcherRoutes);
app.use("/userResearcher", userResearcherRoutes);
app.use('/src/uploads', express.static(path.join(__dirname, '../src/uploads')))
app.use('/files', fileRoutes);
app.use('/mailer', mailerRoutes);
app.use('/announcement', announcementRoutes);
app.use('/userAnnouncement', userAnnouncementRoutes);
app.use('/budget', fundingBudgetRoutes);
app.get('/db/reset', checkJwt, databaseResetController.resetDb);


// Healthcheck endpoint
app.get('/health', (req: Request, res: Response) => {
  // Check if the database is connected
  sequelize
    .authenticate()
    .then(() => {
      res.status(200).json({ status: 'ok' });
    })
    .catch((error: Error) => {
      res.status(500).json({ status: 'error', message: error.message });
    });
});

// Schedule weekly every monday at 11:00
cron.schedule('0 11 * * 1', async () => {
  try {
    const executives = await User.findAll({ where: { roleId: 1 } });
    const executiveEmails = executives.map((executive) => executive.email);
    const response = await checkExecutivePendingItems(executiveEmails);
    console.log(response);
  } catch (error) {
    console.error('Error during weekly check:', error);
  }
});

// Error-handling middleware
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: 'File upload error', error: err });
  } else if (err) {
    return res.status(500).json({ message: 'An unexpected error occurred', error: err });
  }
  next();
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`🚀 API server is running on port ${PORT}`);
});

export default app;