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

# Installs libssl1.1, required by Prisma, from the official Debian 11 (Bullseye) repository
RUN apt-get update && \
    # Temporarily add the Bullseye security repository to the sources list
    echo "deb http://security.debian.org/debian-security bullseye-security main" > /etc/apt/sources.list.d/bullseye-security.list && \
    # Refresh package lists to include the new repository
    apt-get update && \
    # Install libssl1.1 without installing recommended packages
    apt-get install -y libssl1.1 --no-install-recommends && \
    # Clean up by removing the repository file and clearing the apt cache
    rm /etc/apt/sources.list.d/bullseye-security.list && \
    rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm install --production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY prisma ./prisma
COPY .env .env

EXPOSE 8080

CMD ["node", "dist/src/server.js"]