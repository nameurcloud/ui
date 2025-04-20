# --- Build stage ---
    FROM node:18-alpine AS builder
    WORKDIR /app
    
    COPY package*.json ./
    RUN npm install
    
    COPY . .
    RUN npm run build
    
    # --- Production stage ---
    FROM nginx:stable-alpine
    
    # Copy custom nginx config
    COPY nginx.conf /etc/nginx/nginx.conf
    
    # Copy built files
    COPY --from=builder /app/dist /usr/share/nginx/html
    
    # Expose 8080 (Cloud Run default)
    EXPOSE 8080
    
    # Start nginx
    CMD ["nginx", "-g", "daemon off;"]
    