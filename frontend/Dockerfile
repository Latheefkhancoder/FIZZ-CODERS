# Step 1: Build the React/Vite application
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy frontend source code
COPY . .

# Build the production frontend
RUN npm run build


# Step 2: Serve the built app using Nginx
FROM nginx:alpine

# Copy the Vite build output to Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]