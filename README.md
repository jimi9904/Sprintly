# 🚀 Sprintly — Project Management Tool

> A full-stack MERN project management app with real-time collaboration, built with Node.js, Express, React, and MongoDB Atlas.

**🌐 Live Backend:** https://sprintly.onrender.com

---

## 📐 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Docker Network                      │
│                    (sprintly-net)                       │
│                                                         │
│  ┌─────────────────────┐   ┌────────────────────────┐  │
│  │  frontend           │   │  backend               │  │
│  │  React + Vite       │──▶│  Node.js + Express     │  │
│  │  served by Nginx    │   │  Socket.io             │  │
│  │  port 80            │   │  port 5000             │  │
│  └─────────────────────┘   └──────────┬─────────────┘  │
│                                       │                 │
└───────────────────────────────────────┼─────────────────┘
                                        │
                           ┌────────────▼────────────┐
                           │     MongoDB Atlas        │
                           │    (external service)    │
                           └─────────────────────────┘
```

### How it works
| Layer | Technology | Role |
|-------|-----------|------|
| Frontend | React 19, Vite, TailwindCSS | SPA served by Nginx |
| Backend | Node.js 20, Express 4, Socket.io | REST API + WebSocket server |
| Database | MongoDB Atlas | Cloud-hosted NoSQL database |
| Proxy | Nginx | Routes `/api/*`, `/socket.io/*`, `/uploads/*` to backend |
| Auth | JWT + HttpOnly cookies | Stateless authentication |
| Deployment | Render (backend) | Cloud Web Service |

---

## 📁 Project Structure

```
Sprintly/
├── client/                  # React frontend (Vite)
│   ├── src/
│   ├── Dockerfile           # Multi-stage: build → Nginx
│   ├── nginx.conf           # SPA routing + API proxy config
│   └── .dockerignore
├── server/                  # Node.js backend (Express)
│   ├── src/
│   │   ├── server.js        # Entry point
│   │   ├── app.js           # Express app, middleware, routes
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── socket/
│   ├── Dockerfile           # Production Node alpine image
│   └── .dockerignore
├── docker-compose.yml       # Orchestrates both containers
├── .env.docker              # Environment template for Docker (gitignored)
└── README.md
```

---

## 🛠️ Local Development (Without Docker)

### Prerequisites
- Node.js 20+
- npm 9+
- MongoDB Atlas URI (or local MongoDB)

### Backend
```bash
cd server
cp .env .env.local      # Edit with your real values
npm install
npm run dev             # Starts on http://localhost:5000
```

### Frontend
```bash
cd client
# .env already has VITE_API_URL=http://localhost:5000
npm install
npm run dev             # Starts on http://localhost:5173
```

---

## 🐳 Running with Docker

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running

### Step 1 — Configure environment
```bash
# Copy the template and fill in your real secrets
cp .env.docker .env.docker.local
# Then edit .env.docker.local with your actual MONGO_URI, JWT_SECRET, etc.
```

> ⚠️ Rename `.env.docker.local` to `.env.docker` after filling it in, or update `docker-compose.yml` to point to your file.

### Step 2 — Build & start both containers
```bash
docker compose up --build
```

This command will:
1. Build the **backend** image from `server/Dockerfile`
2. Build the **frontend** image from `client/Dockerfile` (Vite build → Nginx)
3. Start both containers on a shared Docker network
4. Frontend will be available at **http://localhost**
5. Backend API directly at **http://localhost:5000**

### Step 3 — Stop containers
```bash
docker compose down
```

To also remove the named volume (uploaded files):
```bash
docker compose down -v
```

---

## 🐳 Docker Commands Reference

| Command | Description |
|---------|-------------|
| `docker compose up --build` | Build images and start all services |
| `docker compose up -d` | Start in detached (background) mode |
| `docker compose down` | Stop and remove containers |
| `docker compose down -v` | Stop containers and remove volumes |
| `docker compose logs backend` | View backend logs |
| `docker compose logs frontend` | View frontend/Nginx logs |
| `docker compose logs -f` | Follow live logs for all services |
| `docker compose ps` | List running containers and their status |
| `docker build -t sprintly-backend ./server` | Build backend image standalone |
| `docker build -t sprintly-frontend ./client` | Build frontend image standalone |
| `docker run -p 5000:5000 --env-file .env.docker sprintly-backend` | Run backend standalone |
| `docker run -p 80:80 sprintly-frontend` | Run frontend standalone |

---

## ☁️ Render Deployment (Backend)

The backend is deployed as a **Web Service** on [Render](https://render.com).

**Live URL:** https://sprintly.onrender.com

### Deployment Steps

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "feat: add Docker configuration"
   git push origin main
   ```

2. **Create a new Web Service on Render**
   - Go to [Render Dashboard](https://dashboard.render.com) → **New** → **Web Service**
   - Connect your GitHub repository
   - Set **Root Directory** to `server`
   - Set **Runtime** to `Node`
   - Set **Build Command**: `npm install`
   - Set **Start Command**: `npm start`

3. **Configure Environment Variables** on Render dashboard:

   | Variable | Value |
   |----------|-------|
   | `NODE_ENV` | `production` |
   | `PORT` | `5000` |
   | `MONGO_URI` | Your MongoDB Atlas connection string |
   | `JWT_SECRET` | Your strong JWT secret |
   | `REFRESH_TOKEN_SECRET` | Your strong refresh secret |
   | `CLIENT_URL` | Your frontend URL (or `*` for open CORS during testing) |

4. **Deploy** — Render auto-deploys on every push to `main`

### Render Configuration (render.yaml — optional)
You can optionally add a `render.yaml` at the root for infrastructure-as-code deployment:
```yaml
services:
  - type: web
    name: sprintly-backend
    runtime: node
    rootDir: server
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 5000
      - key: MONGO_URI
        sync: false
      - key: JWT_SECRET
        sync: false
      - key: REFRESH_TOKEN_SECRET
        sync: false
      - key: CLIENT_URL
        sync: false
```

---

## 🔧 Environment Variables

### Backend (`server/.env`)
| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Port the server listens on | `5000` |
| `MONGO_URI` | MongoDB Atlas connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret for signing access tokens | `a-long-random-string` |
| `REFRESH_TOKEN_SECRET` | Secret for signing refresh tokens | `another-random-string` |
| `CLIENT_URL` | Allowed CORS origin | `http://localhost:5173` |

### Frontend (`client/.env`)
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend base URL | `http://localhost:5000` |

> 🚨 **Note on Docker:** When running via Docker Compose, the frontend Nginx container proxies all `/api/*` requests to the backend container internally. The `VITE_API_URL` env var is only used when running Vite in dev mode (without Docker).

---

## 📦 Docker Images Overview

### Backend Image
```dockerfile
FROM node:20-alpine        # Small base (~50MB)
# Only production dependencies installed (npm ci --omit=dev)
# Exposes port 5000
```

### Frontend Image (Multi-stage)
```dockerfile
# Stage 1: Builder
FROM node:20-alpine        # Builds Vite production bundle
RUN npm run build          # Output → /app/dist

# Stage 2: Runner
FROM nginx:alpine          # Serves the built files (~25MB)
# Custom nginx.conf handles:
#   - React SPA routing (index.html fallback)
#   - /api/* proxied to backend container
#   - /socket.io/* proxied with WebSocket upgrade
#   - /uploads/* proxied to backend
#   - Static asset caching (1 year)
```

---

## ⚠️ Known Limitations

- **File Uploads**: The `multer` upload middleware stores files inside the container at `/app/uploads`. Docker Compose mounts this as a named volume (`uploads_data`) so files persist across restarts. However, on Render's free tier, the filesystem is ephemeral — consider migrating to Cloudinary or AWS S3 for production.
- **Free Render Tier**: Render free services spin down after 15 minutes of inactivity and take ~30 seconds to cold-start on the next request.

---

## 🤝 Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19 | Frontend UI |
| Vite | 7 | Build tool & dev server |
| TailwindCSS | 3 | Utility-first styling |
| Framer Motion | 12 | Animations |
| Node.js | 20 | Backend runtime |
| Express | 4 | HTTP framework |
| Socket.io | 4 | Real-time WebSockets |
| Mongoose | 8 | MongoDB ODM |
| MongoDB Atlas | — | Cloud database |
| Nginx | alpine | Production static server + reverse proxy |
| Docker | — | Containerization |
| Render | — | Backend cloud deployment |
