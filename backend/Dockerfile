# Alpine 3.16: OpenSSL 1.1 varsayılan (Prisma uyumlu), 3.19+ paket yok
FROM node:18-alpine3.16

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 5000

# Start server
CMD ["npm", "start"]
