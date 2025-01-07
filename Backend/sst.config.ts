// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "sciencenia-api-prod",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
      providers: {
        aws: {
          profile: input.stage === "production" ? "cenia" : "default"
        },
        cloudflare: {
          version: "5.40.0",
        },
      },
    };
  },
  async run() {
    if($app.stage == "production"){
      return await deploy_production();
    }else{
      return await deploy_other();
    }
  },  
});


// Production infrastructure
async function deploy_production() {

  const AUTH0_ISSUER = "https://scenia-hub.us.auth0.com/";
  const AUTH0_AUDIENCE = "https://sciencenia-hub/";
  const LAST_DEPLOY_TIME = new Date().toLocaleString('en-GB', { timeZone: 'America/Santiago', hour12: false });

  // Domain
  const domain = { name: process.env.DOMAIN, dns: sst.cloudflare.dns() };

  // Create VPC
  const vpc = new sst.aws.Vpc("ScienceniaVPC");

  // Create RDS database
  const rdsDatabase = new sst.aws.Postgres("ScienceniaDB", { vpc });

  // Creare S3 bucket for static assets
  const bucket = new sst.aws.Bucket("ScienceniaBucket");
  const bucketOwnershipControls = new aws.s3.BucketOwnershipControls("BucketOwnershipControls", {
    bucket: bucket.name,
    rule: { objectOwnership: "BucketOwnerPreferred" },
  });
  const bucketPublicAccessBlock = new aws.s3.BucketPublicAccessBlock("BucketPublicAccessBlock", {
    bucket: bucket.name,
  });
  
  // Create ECS cluster
  const cluster = new sst.aws.Cluster("ScienceniaAPI", { vpc });

  // Create ECS service
  const service = cluster.addService("ScienceniaServiceAPI", {
    public: {
      ports: [{ listen: "443/https", forward: "3000/http"}],
      domain: domain,
    },
    link: [bucket, rdsDatabase],
    environment: {
      AUTH0_ISSUER,
      AUTH0_AUDIENCE,
      AUTH0_M2M_CLIENT_ID: process.env.AUTH0_M2M_CLIENT_ID,
      AUTH0_M2M_CLIENT_SECRET: process.env.AUTH0_M2M_CLIENT_SECRET,
      GMAIL_APP_USER: process.env.GMAIL_APP_USER,
      GMAIL_APP_PASSWORD: process.env.GMAIL_APP_PASSWORD,
      FIREBASE_CREDENTIALS: process.env.FIREBASE_CREDENTIALS,
      LAST_DEPLOY_TIME,
      S3_BUCKET_NAME: bucket.name,
    },
    logging: {
      retention: "1 week",
    },
  });

  const logsCommand = `aws logs tail /sst/cluster/${$app.name}-${$app.stage}-ScienceniaAPICluster/ScienceniaServiceAPI/ScienceniaServiceAPI --follow`;

  return {
    vpc: vpc.id,
    bucket: bucket.name,
    service: service.url,
    logs: logsCommand,
  };
}


// Cheaper infrastructure for other stages
async function deploy_other() {
  const AUTH0_ISSUER = process.env.AUTH0_ISSUER || "https://scenia-hub.us.auth0.com";
  const AUTH0_AUDIENCE = process.env.AUTH0_AUDIENCE || "https://sciencenia-hub/" 
  const LAST_DEPLOY_TIME = new Date().toLocaleString('en-GB', { timeZone: 'America/Santiago', hour12: false });

  const POSTGRES_USER = process.env.DATABASE_USER || "db";  
  const POSTGRES_PASSWORD = process.env.DATABASE_PASSWORD || "db";
  const POSTGRES_DB = process.env.DATABASE_NAME || "db";

  // Domain
  const domain = process.env.CLOUDFLARE_API_TOKEN && process.env.DOMAIN ? 
    { 
      name: $app.stage + "." + process.env.DOMAIN, 
      dns: sst.cloudflare.dns() 
    } : undefined;

  // Create VPC
  const vpc = new sst.aws.Vpc("ScienceniaVPC");

  // Creare S3 bucket for static assets
  const bucket = new sst.aws.Bucket("ScienceniaBucket");
  const bucketOwnershipControls = new aws.s3.BucketOwnershipControls("BucketOwnershipControls", {
    bucket: bucket.name,
    rule: { objectOwnership: "BucketOwnerPreferred" },
  });
  const bucketPublicAccessBlock = new aws.s3.BucketPublicAccessBlock("BucketPublicAccessBlock", {
    bucket: bucket.name,
  });
  
  // Create EFS file system for persistent data storage
  const efs = new sst.aws.Efs("ScienceniaEfs", { vpc });

  // Create ECS cluster
  const cluster = new sst.aws.Cluster("ScienceniaAPI", { vpc });

  // Create ECS service with two containers: Postgres and API
  const service = cluster.addService("ScienceniaServiceAPI", {
    public: {
      ports: [{ 
        container: "api",
        listen: "443/https", 
        forward: "3000/http" 
      }],
      domain: domain,
    },
    link: [bucket],
    containers: [
      {
        name: "api",
        environment: {
          DATABASE_HOST: "localhost",
          DATABASE_USER: POSTGRES_USER,
          DATABASE_PASSWORD: POSTGRES_PASSWORD,
          DATABASE_NAME: POSTGRES_DB,
          AUTH0_ISSUER,
          AUTH0_AUDIENCE,
          AUTH0_M2M_CLIENT_ID: process.env.AUTH0_M2M_CLIENT_ID,
          AUTH0_M2M_CLIENT_SECRET: process.env.AUTH0_M2M_CLIENT_SECRET,
          LAST_DEPLOY_TIME,
          S3_BUCKET_NAME: bucket.name,
        },
        logging: {
          retention: "1 week",
        },
      },
      {
        name: "postgres",
        image: "postgres:14", // Postgres version 14
        environment: {
          POSTGRES_USER,
          POSTGRES_PASSWORD,
          POSTGRES_DB,
        },
        volumes: [
          {
            efs: efs,
            path: "/var/lib/postgresql/data", // Mount EFS to Postgres data directory
          },
        ],
      },
    ],
  });

  const logsCommand = `aws logs tail /sst/cluster/${$app.name}-${$app.stage}-ScienceniaAPICluster/ScienceniaServiceAPI/api --follow`;

  return {
    vpc: vpc.id,
    bucket: bucket.name,
    service: service.url,
    logs: logsCommand,
  };
}