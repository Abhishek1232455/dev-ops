FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
WORKDIR /app/backend
COPY backend/package.json ./
RUN npm install --production

FROM base AS app
WORKDIR /app

COPY frontend ./frontend
COPY backend ./backend
COPY --from=deps /app/backend/node_modules ./backend/node_modules

WORKDIR /app/backend

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "server.js"]

