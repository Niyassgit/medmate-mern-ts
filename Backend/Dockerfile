FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production deps
RUN npm ci

# Copy Prisma schema
COPY prisma ./prisma/

# Generate Prisma client
RUN npx prisma generate

# Copy source
COPY . .

# Build TypeScript
RUN npm run build

# Remove dev dependencies
RUN npm prune --omit=dev

# Create uploads directory structure (empty, will be populated at runtime)
RUN mkdir -p uploads/licenses \
    uploads/company-logo \
    uploads/others

EXPOSE 5000

CMD ["npm", "start"]