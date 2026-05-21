# ─── Stage: Production ───────────────────────────────────────────────────────
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy application source
COPY . .

# Set environment
ENV NODE_ENV=production

# Expose the API port
EXPOSE 5000

# Start the server
CMD ["node", "src/server.js"]