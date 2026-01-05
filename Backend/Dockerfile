FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first for better caching
COPY package.json package-lock.json ./
RUN npm ci --only=production=false

# Copy configuration files
COPY tsconfig.json ./
COPY prisma ./prisma

# Generate Prisma Client
RUN npx prisma generate

# Copy source files (excluding uploads via .dockerignore)
COPY src ./src

# Build TypeScript
RUN npm run build

FROM node:20-alpine

WORKDIR /app

# Copy package files for production dependencies
COPY package.json package-lock.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy built application, Prisma files, and generated Prisma Client
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Create uploads directory structure (empty, will be populated at runtime)
RUN mkdir -p src/infrastructure/storage/uploads/licenses \
    src/infrastructure/storage/uploads/company-logo \
    src/infrastructure/storage/uploads/others

EXPOSE 5000

CMD ["npm", "start"]