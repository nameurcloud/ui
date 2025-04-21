# Step 1: Build the app
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Step 2: Serve with a lightweight HTTP server
FROM node:18-alpine
WORKDIR /app

# Install "serve" to serve static files
RUN npm install -g serve

# Copy build from previous stage
COPY --from=builder /app/dist ./dist

# Set environment variable for Cloud Run
ENV PORT 8080

# Expose the port
EXPOSE 8080

# Start the app
CMD ["serve", "-s", "dist", "-l", "8080"]
