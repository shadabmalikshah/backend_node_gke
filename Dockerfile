# Use official Node.js image
FROM node:18

# Create app directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies (excluding devDependencies)
RUN npm ci --omit=dev

# Copy the rest of the app
COPY . .

# Set environment
ENV NODE_ENV=production

# Expose port (as used in your backend)
EXPOSE 4000

# Start the app
CMD ["node", "server.js"]
