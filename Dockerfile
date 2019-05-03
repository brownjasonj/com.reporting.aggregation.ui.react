FROM node:latest

# Create directory for the application
RUN mkdir -p /srv/app/com.reporting.aggregation.ui.react
WORKDIR /srv/app/com.reporting.aggregation.ui.react

COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .
COPY tslint.json .

COPY ./public ./public
COPY ./src ./src

RUN npm install

CMD [ "npm", "start"]