# Build stage
FROM node:20-slim AS builder

WORKDIR /app

# Install build tools in case native compilation is needed
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

COPY package.json ./
# Install ALL dependencies without triggering lifecycle scripts prematurely
RUN npm install --legacy-peer-deps --ignore-scripts

COPY . .
# Build the application (runs prebuild -> build -> postbuild)
RUN npm run build

# Prune devDependencies to keep only production modules
RUN npm prune --omit=dev --legacy-peer-deps --ignore-scripts

# Production stage
FROM node:20-slim AS production

WORKDIR /app

# Install chromium and fonts for Puppeteer
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-freefont-ttf \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

COPY package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/scripts ./scripts

RUN mkdir -p dist/modules

EXPOSE 10000

CMD ["node", "dist/main.js"]
