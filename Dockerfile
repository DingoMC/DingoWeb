# Step 1: Build the React app
FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

# Step 2: Serve the built app with HTTPS
FROM node:22-alpine

# Install 'serve'
RUN npm install -g serve

# Create app directory
WORKDIR /app

# Copy build output from previous stage
COPY --from=build /app/build ./build

# Expose the HTTPS port
EXPOSE 8000

# Start the server
CMD ["serve", "-p", "8000", "-s", "build"]
