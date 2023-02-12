# Use an official Node.js runtime as the base image
FROM node:slim

# Set the working directory in the container
WORKDIR /index.js

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install the dependencies in the container
RUN npm install

#expose the port
EXPOSE 8000

# Copy the rest of the application code to the container
COPY . .

# Specify the command to run when the container starts
CMD [ "npm", "start" ]

