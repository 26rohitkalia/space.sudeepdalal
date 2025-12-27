FROM node:22-alpine

WORKDIR /app

# Copy package.json only first (better caching)
COPY package.json ./

# --legacy-peer-deps is REQUIRED for Next.js 15 + React 19 RC
RUN npm install --legacy-peer-deps

# Copy the rest of the source code
COPY . .

# Next.js default port
EXPOSE 3000

# Start dev server
CMD ["npm", "run", "dev"]