const dgram = require('dgram')
const path = require('path')
const AutoLoad = require('@fastify/autoload')
require('dotenv').config()

const fastify = require('fastify')({
    logger:true
})

const UDP_HOST = process.env.UDP_HOST;
const UDP_PORT = process.env.UDP_PORT;

console.log('===== ENV =====');
console.log('UDP_HOST: ', UDP_HOST);
console.log('UDP_PORT: ', UDP_PORT);
console.log('===============');

module.exports.options = {};
const {
    close,
    connect,
    error,
    message,
} = require('./services/listener');

const eventList = {
    close,
    connect,
    error,
    message,
};

const udpSocket = dgram.createSocket('udp4')
for (const e in eventList) {
    udpSocket.addListener(e, (_a, _b) => eventList[e](udpSocket, _a, _b));
}

udpSocket.on('listening', () => {
    console.log(`UDP  is Listening on  udp://${UDP_HOST}:${UDP_PORT}`)
});

udpSocket.bind(UDP_PORT, UDP_HOST)