# Use a Node.js base image
FROM node:14-alpine

# Set the working directory inside the container
WORKDIR /src

# Copy the package files to the container
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of your application code to the container
COPY . .

# Expose the port your application listens on (if necessary)
EXPOSE 3000

# Command to run your application
CMD ["npm", "start"]
