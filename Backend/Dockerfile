# Use a specific Bun version
FROM oven/bun:1.1.8-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and lockfile
COPY package.json bun.lockb* ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy the rest of the application
COPY . .

# RUN [ ! -d "src/uploads" ] && mkdir src/uploads || echo "Directory 'uploads' already exists"
RUN mkdir -p src/uploads
# Set NODE_ENV to production by default
ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV

# For the healthcheck
RUN apk add --no-cache curl

# Set up AWS RDS CA cert
RUN apk add --no-cache ca-certificates

# Download and install AWS RDS CA certificates
RUN mkdir -p /usr/local/share/ca-certificates/aws-rds \
    && curl -sSL "https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem" -o /usr/local/share/ca-certificates/aws-rds/rds-combined-ca-bundle.pem \
    && update-ca-certificates

# Expose the port the app runs on
EXPOSE 3000

# Healthcheck
HEALTHCHECK --start-period=20s CMD curl -f http://localhost:3000/health || exit 1

# Run the app
CMD ["sh", "-c", "bun run src/db/migrate.ts && bun start"]