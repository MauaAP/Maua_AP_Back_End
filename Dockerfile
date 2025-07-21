# ============================
# Etapa 1: BUILD (npm, prisma, ts)
# ============================
FROM node:20-slim AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npx prisma generate
RUN npm run build

# ============================
# Etapa 2: PRODUÇÃO
# ============================
FROM node:20-slim

WORKDIR /app

# Instala libssl1.1 para o Prisma
RUN apt-get update && \
    echo "deb http://security.debian.org/debian-security bullseye-security main" > /etc/apt/sources.list.d/bullseye-security.list && \
    apt-get update && \
    apt-get install -y libssl1.1 --no-install-recommends && \
    rm /etc/apt/sources.list.d/bullseye-security.list && \
    rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm install --production

# Instala o navegador Chromium e suas dependências de sistema para o Playwright
RUN npx playwright install --with-deps chromium

# Copia os artefatos da etapa de build
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY prisma ./prisma

EXPOSE 8080

CMD ["node", "dist/src/server.js"]