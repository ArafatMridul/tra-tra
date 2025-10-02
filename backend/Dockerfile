FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps || true

COPY tsconfig.json drizzle.config.ts ./
COPY src ./src

RUN npm run build

EXPOSE 4000
CMD ["node", "dist/server.js"]
