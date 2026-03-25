# Stage 1: Build the Angular application
FROM node:20-alpine AS build
WORKDIR /app

# Copy dependency definitions
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Copy the custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built Angular application to Nginx's HTML directory
# Default Angular 17+ output path for the application builder
COPY --from=build /app/dist/fs-frontend/browser /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
