# base image
FROM node:12.14.1

COPY package.json .
RUN npm install
COPY . .

# start server in dev
CMD ["node", "app.js"]

# heroku container:login
# heroku container:push web
# heroku container:release web
# heroku open