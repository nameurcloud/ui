# ========================
# Step 1: Build Vite app
# ========================
FROM node:23-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source and build
COPY . .
RUN npm run build  # Output goes to /dist


# ========================
# Step 2: Runtime image (Express server)
# ========================
FROM node:23-alpine

WORKDIR /app

# Install only required runtime packages
COPY package*.json ./
RUN npm install --omit=dev \
    express \
    express-static-gzip \
    http-proxy-middleware \
    google-auth-library

# Copy built app and proxy server
COPY --from=builder /app/dist ./dist
COPY ./src/services/proxy.js ./proxy.js


# Set environment variables (optional)
ENV PORT=8080

# Expose port for Cloud Run
EXPOSE 8080

# Run the Express server
CMD ["node", "proxy.js"]
