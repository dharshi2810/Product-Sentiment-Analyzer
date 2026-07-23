FROM node:20-alpine as build

WORKDIR /app

# Copy package.json and install dependencies
COPY package.json .
# Note: In a real environment, you'd have a package-lock.json to copy as well
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build

# Use Nginx to serve the built static files
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx configuration for React Router
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
