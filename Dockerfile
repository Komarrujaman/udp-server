FROM node:20.18.0-alpine3.19
RUN mkdir -p /opt/app
WORKDIR /opt/app
COPY . .
RUN npm install
RUN npm install -g nodemon
RUN chmod +x ./node_modules/.bin/nodemon
RUN chmod +x /opt/app/node_modules/.bin/nodemon
EXPOSE 3000
EXPOSE 5000/udp
CMD [ "npm", "start"]