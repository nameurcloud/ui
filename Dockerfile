# --- Build stage ---
    FROM node:18-alpine AS builder
    WORKDIR /app
    
    # Install dependencies
    COPY package*.json ./
    RUN npm install
    
    # Copy source and build
    COPY . .
    RUN npm run build
    
    # --- Production stage ---
        FROM nginx:stable-alpine

        # Copy custom nginx config
        COPY nginx.conf /etc/nginx/nginx.conf
        
        # Copy frontend build
        COPY --from=builder /app/dist /usr/share/nginx/html
        
        EXPOSE 8080
        CMD ["nginx", "-g", "daemon off;"]
    
