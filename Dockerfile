# ==========================================
# Stage 1: Build & Type Generation
# ==========================================
FROM node:22-bookworm-slim AS builder

WORKDIR /app

# Install native compilation dependencies for argon2, bcrypt, sharp
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy dependency manifests
COPY package.json pnpm-workspace.yaml* ./

# Install all dependencies (including devDependencies required for compilation)
RUN npm install

# Copy application source code and scripts
COPY . .

# Generate Sequelize model types and build NestJS
RUN npm run generate-types
RUN npm run build

# Remove development dependencies
RUN npm prune --omit=dev

# ==========================================
# Stage 2: Production Runtime
# ==========================================
FROM node:22-bookworm-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5002

# Runtime dependencies for Puppeteer (Chromium) & libvips
RUN apt-get update && apt-get install -y --no-install-recommends \
    chromium \
    fonts-liberation \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Run as non-root user for security
RUN groupadd -g 1001 nodejs && useradd -u 1001 -g nodejs nestjs

# Copy artifacts from builder
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nestjs:nodejs /app/src/modules/email/templates ./src/modules/email/templates

USER nestjs

EXPOSE 5002

CMD ["node", "dist/main.js"]
