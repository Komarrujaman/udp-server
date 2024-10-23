FROM node:20.18.0-alpine3.19
RUN mkdir -p /opt/app
WORKDIR /opt/app
COPY . .
RUN npm install
EXPOSE 3000
EXPOSE 5000/udp
CMD [ "npm", "start"]