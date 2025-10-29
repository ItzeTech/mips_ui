# frontend/Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies with --legacy-peer-deps
RUN npm install --legacy-peer-deps

# Copy the rest of the app
COPY . .

# ⭐ Accept build arguments
ARG GENERATE_SOURCEMAP
ARG REACT_APP_API_BASE_URL
ARG REACT_APP_WS_BASE_URL
ARG NODE_ENV=production

# ⭐ Set as environment variables for build
ENV GENERATE_SOURCEMAP=$GENERATE_SOURCEMAP
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL
ENV REACT_APP_WS_BASE_URL=$REACT_APP_WS_BASE_URL
ENV NODE_ENV=$NODE_ENV

# Build the app
RUN npm run build

# Install serve globally
RUN npm install -g serve

# Expose port
EXPOSE 3000

# Serve the build folder
CMD ["serve", "-s", "build", "-l", "3000"]
