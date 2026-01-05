FROM node:20-alpine AS builder

WORKDIR /index

COPY package.json package-lock.json ./
RUN npm install

COPY tsconfig.json ./
COPY src ./src
COPY prisma ./prisma

# Generate Prisma Client
RUN npx prisma generate

#Build TypeScript
RUN npm run build

FROM node:18-alpine

WORKDIR /app

# Copy runtime artifacts
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma


EXPOSE 5000
CMD ["npm", "start"]
