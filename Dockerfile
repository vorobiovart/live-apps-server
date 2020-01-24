# base image
FROM node:12.14.1

# set working directory
WORKDIR /app

RUN npm install nodemon -g

# install and cache app dependencies
COPY package.json /app

RUN npm install --silent

EXPOSE 5000

# start server in dev
CMD ["nodemon", "app.js"]

# to run docker after build
# docker build -t server:dev .
# docker run -v /${PWD}:/app -v /app/node_modules -p 5000:5000 -e CHOKIDAR_USEPOLLING=true --rm server:dev