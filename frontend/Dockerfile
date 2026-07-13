FROM node:20-alpine

WORKDIR /frontend

# Copy dependencies manifest
COPY package*.json ./

# Install packages
RUN npm install

# Copy frontend source files
COPY . .

# Expose dev port
EXPOSE 5173

# Start dev server
CMD ["npm", "run", "dev"]
