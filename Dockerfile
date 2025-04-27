# ========================
# Step 1: Build Vite app
# ========================
FROM node:23-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build   # Builds Vite app to /dist

# ========================
# Step 2: Serve Frontend + Secure Proxy (Express)
# ========================
FROM node:23-alpine

WORKDIR /app

# Only runtime dependencies (smaller final image)
COPY package*.json ./
RUN npm install express http-proxy-middleware google-auth-library express-static-gzip

# Copy built Vite app
COPY --from=builder /app/dist ./dist

# Copy proxy server code
COPY ./src/services/proxy.js ./proxy.js

# Expose the port
EXPOSE 8080

# Start Express server
CMD ["node", "proxy.js"]
