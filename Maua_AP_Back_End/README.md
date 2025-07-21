# Use the official Node.js image as a base
FROM node:14

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the application dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]
```

### Explanation of the Dockerfile:

1. **FROM node:14**: This line specifies the base image. Here, we are using the official Node.js image with version 14. You can change this to the version that your application requires.

2. **WORKDIR /usr/src/app**: This sets the working directory inside the container. All subsequent commands will be run from this directory.

3. **COPY package*.json ./**: This copies your `package.json` and `package-lock.json` files to the working directory. This is done separately to leverage Docker's caching mechanism, so that if your dependencies haven't changed, Docker can skip the `npm install` step.

4. **RUN npm install**: This installs the application dependencies defined in `package.json`.

5. **COPY . .**: This copies the rest of your application code into the container.

6. **EXPOSE 3000**: This tells Docker that the container listens on port 3000 at runtime. Change this to the port your application uses.

7. **CMD ["npm", "start"]**: This specifies the command to run your application when the container starts.

### Customization:

- If your application is built with a different technology stack (like Python, Java, etc.), you will need to adjust the base image and the commands accordingly.
- Make sure to replace the port number and the command to run your application based on your specific setup.

### Building and Running the Docker Image:

1. **Build the Docker image**:
   ```bash
   docker build -t my-app .
   ```

2. **Run the Docker container**:
   ```bash
   docker run -p 3000:3000 my-app
   ```

Replace `my-app` with your desired image name and adjust the port mapping as necessary.