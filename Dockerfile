# ==========================================
# Stage 1: Build & Type Generation
# ==========================================
FROM node:22-bookworm-slim AS builder

WORKDIR /app

# Copy all source files
COPY . .

# Install all dependencies (including devDependencies required for compilation)
RUN npm install --legacy-peer-deps

# Build NestJS (prebuild will also run generate-types automatically)
RUN npm run build

# Remove development dependencies
RUN npm prune --omit=dev --legacy-peer-deps

# ==========================================
# Stage 2: Production Runtime
# ==========================================
FROM node:22-bookworm-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5002

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
