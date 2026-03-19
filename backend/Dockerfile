# Stage 1: Install dependencies
FROM node:18-alpine AS deps

WORKDIR /app
COPY package*.json ./
RUN npm install --only=production

# Stage 2: Final image
FROM node:18-alpine

WORKDIR /app

# Copy only necessary files
COPY --from=deps /app/node_modules ./node_modules
COPY . .

EXPOSE 5000

CMD ["node", "index.js"]