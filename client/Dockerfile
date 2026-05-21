# ─── Stage 1: Build ──────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests and install
COPY package*.json ./
RUN npm ci

# Copy source and build for production
# VITE_API_URL is baked in at build time via --build-arg
ARG VITE_API_URL=http://localhost:5000
ENV VITE_API_URL=$VITE_API_URL

COPY . .
RUN npm run build


# ─── Stage 2: Serve with Nginx ───────────────────────────────────────────────
FROM nginx:alpine AS runner

# Remove default Nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom config for React SPA + API proxy
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the Vite production build
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose HTTP port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
