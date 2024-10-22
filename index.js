const dgram = require('dgram')
const path = require('path')
const AutoLoad = require('@fastify/autoload')
require('dotenv').config()

const fastify = require('fastify')({
    logger:true
})

const UDP_HOST = process.env.UDP_HOST;
const UDP_PORT = process.env.UDP_PORT;
const HTTP_HOST = process.env.HTTP_HOST;
const HTTP_PORT = process.env.HTTP_PORT;

console.log('===== ENV =====');
console.log('UDP_HOST: ', UDP_HOST);
console.log('UDP_PORT: ', UDP_PORT);
console.log('HTTP_HOST: ', HTTP_HOST);
console.log('HTTP_PORT: ', HTTP_PORT);
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

fastify.get('/health', async () => {
    return { status: true }
});

fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: Object.assign({})
  });

const start = async () => {
    try {
        await fastify.listen({ port: HTTP_PORT, host: HTTP_HOST }, (err, address) => {
        if (err) {
            fastify.log.error(err)
            process.exit(1)
        }
        console.log(`HTTP is listening on ${address}`);
    });
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}
  // Start HTTP
start();