# Simple dockerfile for testing the backend on a web host

FROM node:20.12-alpine

# make the 'app' folder the current working directory
WORKDIR /app

# copy both 'package.json' and 'package-lock.json' (if available)
COPY ./backend/package*.json ./

# install project dependencies
RUN npm install

# copy project files and folders to the current working directory (i.e. 'app' folder)
COPY ./backend .

EXPOSE 8080
CMD [ "npm", "run", "mock" ]