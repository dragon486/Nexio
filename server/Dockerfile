# Production Dockerfile for Nexio
# Goal: Minimal footprint, hardened security, and multi-role versatility.

# Build Stage (Optional: if we had a build step, for now we just install)
FROM node:20-slim AS builder

WORKDIR /app

# Install build dependencies if needed (none currently required for pure JS)
COPY package*.json ./
RUN npm ci --only=production

# Production Stage
FROM node:20-slim

WORKDIR /app

# Copy production dependencies from builder
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./

# Copy source code
COPY . .

# Security: Hardening for production (Non-root user)
# We use the built-in 'node' user provided by the base image.
RUN chown -R node:node /app
USER node

# Networking: Explicitly expose the API port
EXPOSE 8080

# Entrypoint: Default to API Server. 
# ECS Task Definition will override this for the Worker role.
CMD ["node", "server.js"]
