# Lightweight production container for Local Move
FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000
ENV NODE_OPTIONS="--max-old-space-size=384"

# Copy package manifests
COPY package.json package-lock.json ./

# Install only production runtime dependencies
RUN npm install --omit=dev --no-audit --no-fund

# Copy pre-built frontend SPA and backend API
COPY dist ./dist
COPY server/dist ./server/dist

# Expose HTTP port
EXPOSE 5000

# Start unified production server
CMD ["node", "server/dist/index.js"]
