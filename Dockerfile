# Multi-stage production Dockerfile for Local Move (Aera)
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package.json package-lock.json ./
COPY server/package.json ./server/

# Install dependencies
RUN npm ci
RUN cd server && npm ci

# Copy full source
COPY . .

# Build React 19 frontend into /app/dist and Express backend into /app/server/dist
RUN npm run build
RUN npm run server:build

# Production runtime stage
FROM node:22-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=5000

# Copy node_modules and built code
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server/package.json ./server/
COPY --from=builder /app/server/node_modules ./server/node_modules
COPY --from=builder /app/server/dist ./server/dist

# Expose ports: 5000 (HTTP/SPA/API) and 5432 (Postgres wire protocol)
EXPOSE 5000
EXPOSE 5432

# Start the unified backend & static SPA server
CMD ["node", "server/dist/index.js"]
