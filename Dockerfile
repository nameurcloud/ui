# ========================
# Step 1: Build Vite app
# ========================
FROM node:18-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build   # builds frontend to /dist

# ========================
# Step 2: Run Express server
# ========================
FROM node:18-alpine
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --production

# Install ts-node for running TypeScript server
RUN npm install -g ts-node typescript

# Copy server (TypeScript) and built frontend
COPY --from=builder /app/dist ./dist
COPY ./server ./server
COPY ./tsconfig.json ./

# Set environment variable for Cloud Run
ENV PORT 8080
EXPOSE 8080

# Start Express (this should also serve frontend + proxy API)
CMD ["ts-node", "server/index.ts"]
