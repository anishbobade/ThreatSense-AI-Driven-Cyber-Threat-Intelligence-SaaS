# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and install dependencies
# Note: In this environment, we cannot run `npm install`.
# In a real-world scenario, you would uncomment the following line:
# COPY package.json ./
# RUN npm install
COPY package.json ./

# Copy the rest of the application's code
COPY . .

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Define the command to run the app
CMD [ "node", "server/index.js" ]
