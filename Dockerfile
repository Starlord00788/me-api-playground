# Use Node.js 18 Alpine for smaller image size
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json files
COPY backend/package*.json ./backend/
COPY package*.json ./

# Install dependencies
RUN cd backend && npm ci --only=production

# Copy backend source code
COPY backend/ ./backend/

# Copy frontend (for serving static files if needed)
COPY frontend/ ./frontend/

# Generate Prisma client
RUN cd backend && npx prisma generate

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (res) => process.exit(res.statusCode === 200 ? 0 : 1))" || exit 1

# Start the application
CMD ["node", "backend/src/app.js"]