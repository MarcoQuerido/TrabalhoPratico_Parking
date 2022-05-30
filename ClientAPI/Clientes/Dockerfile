FROM node:17-alpine3.12
WORKDIR /usr/src/app

COPY package*.json ./
COPY server.js ./

RUN npm install --only=production

COPY ./src ./src
COPY ./api-docs ./api-docs

EXPOSE 5000

CMD npm start