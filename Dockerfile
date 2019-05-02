FROM node:8.7.0-alpine

# Create directory for the application
RUN mkdir -p /srv/app/com.reporting.aggregation.ui.react
WORKDIR /srv/app/com.reporting.aggregation.ui.react

COPY package.json .
COPY package-lock.json .

COPY ./src ./src

RUN npm install

CMD [ "npm", "start"]