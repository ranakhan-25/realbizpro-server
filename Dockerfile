# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies for native modules (argon2, sharp, etc.)
RUN apk add --no-cache python3 make g++ vips-dev

COPY package*.json ./
RUN npm ci --legacy-peer-deps

COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

RUN apk add --no-cache vips chromium nss freetype harfbuzz ca-certificates ttf-freefont

# Puppeteer - use system chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

COPY package*.json ./
RUN npm ci --only=production --legacy-peer-deps

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/scripts ./scripts

# Copy firebase service account if exists
RUN mkdir -p dist/modules

EXPOSE 10000

CMD ["node", "dist/main.js"]
