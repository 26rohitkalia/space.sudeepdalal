FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source
COPY . .

# Next.js default port
EXPOSE 3000

# Start dev server
CMD ["npm", "run", "dev"]
