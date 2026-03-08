# MagicURL – Enchanted URL Shortener

MagicURL is a whimsical, **Magic World** themed URL shortener built with **HTML/CSS/Vanilla JS**, **Node.js (Express)**, **MongoDB**, and a **Docker + Jenkins + AWS EC2** deployment pipeline.

## Project Structure

- `frontend/` – Static magical UI (HTML, CSS, JS)
- `backend/` – Express API, MongoDB models, and server
- `Dockerfile` – Multi-stage Node image for app
- `docker-compose.yml` – App + MongoDB for local/dev
- `Jenkinsfile` – Declarative CI/CD pipeline
- `.gitignore` – Git hygiene

## Prerequisites

- Node.js 18+ and npm
- MongoDB (local or remote)
- Docker & Docker Compose (for containerized runs)
- Jenkins and an AWS EC2 instance (for full CI/CD)

## Backend Configuration

The backend reads:

- `PORT` (default: `3000`)
- `MONGO_URI` (default: `mongodb://mongo:27017/magicurl` when running in Docker)

For local development without Docker, you will likely want:

```bash
export MONGO_URI="mongodb://localhost:27017/magicurl"
export PORT=3000
```

## Run Locally (no Docker)

1. Install backend dependencies:

```bash
cd backend
npm install
```

2. Start MongoDB (e.g. `mongod` or via your OS service).

3. Start the backend server:

```bash
npm run dev
```

4. Open the app in the browser:

- Visit `http://localhost:3000`
- The backend serves the static frontend from `frontend/`, and the form will call `POST /api/shorten`.

## Run with Docker Compose

From the project root (`MagicURL/`):

```bash
docker-compose up --build
```

- App: `http://localhost:3000`
- MongoDB: `mongodb://localhost:27017/magicurl`

To stop:

```bash
docker-compose down
```

## Standalone Docker Image

Build the app image:

```bash
docker build -t magic-url-app .
```

Run the app (expects a MongoDB instance reachable via `MONGO_URI`):

```bash
docker run -p 3000:3000 \
  -e MONGO_URI="mongodb://host.docker.internal:27017/magicurl" \
  magic-url-app
```

Then open `http://localhost:3000`.

## Git & GitHub

Example first-time setup:

```bash
git init
git add .
git commit -m "Initial commit: MagicURL project structure"
git remote add origin <your-github-repo-url>
git push -u origin main
```

Use small, descriptive commits, for example:

- `feat: add magical glassmorphism UI`
- `feat: implement URL shortening API`
- `chore: add Dockerfile and compose`
- `ci: create Jenkins pipeline`

## Jenkins CI/CD (Overview)

The `Jenkinsfile` defines a declarative pipeline with stages:

- **Checkout** – Clone the Git repo.
- **Build Docker image** – Build `magic-url-app` Docker image.
- **Test** – Run a basic `/health` check in a temporary container.
- **Push image** – Push to your Docker registry.
- **Deploy to EC2** – SSH into an EC2 host and run the container.

You must:

- Replace `your-docker-registry.example.com` and `your-ec2-host` with your real values.
- Configure Jenkins credentials:
  - `docker-registry-creds` – Docker registry credentials.
  - `ec2-ssh-creds` – SSH key for your EC2 instance.

## Frontend Magic

The frontend uses:

- Dark purple/blue gradients
- Neon glows and floating aurora-style nebula
- Glassmorphism for the “spellbook” card

Users type a long URL, hit **“Cast Spell”**, and receive a short enchanted link that redirects via the backend.

