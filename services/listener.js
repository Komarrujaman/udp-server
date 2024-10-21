const { handleUdp } = require('./handler')

const handler = async (f, s, a, b) => {
    try {
        await f(s, a, b);
    } catch (error) {
        console.log(error.message);
    }
}

const close = (s, a, b) => {
    console.log(new Date(), 'close');
}

const connect = (s, a, b) => {
    console.log(new Date(), 'connect');
}

const error = (s, a, b) => {
    console.log(new Date(), 'error', a);
}

const message = (s, a, b) => {
    console.log(new Date(), 'message', a);
    try {
        handler(handleUdp, s, a, b);
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    close,
    connect,
    error,
    message,
};