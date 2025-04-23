# ========================
# Step 1: Build Vite app
# ========================
FROM node:18-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build   # Builds Vite app to /dist

# ========================
# Step 2: Run Express + Serve Frontend
# ========================
FROM node:18-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install --production

# Install Express-related dependencies globally
RUN npm install -g ts-node typescript

# Copy built frontend and server code
COPY --from=builder /app/dist ./dist
COPY ./server ./server
COPY ./tsconfig.json ./

ENV PORT=8080
EXPOSE 8080

CMD ["ts-node", "server/index.ts"]
