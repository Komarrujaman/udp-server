const { getDeviceIdAndSerialNumber } = require("./parser");

const handleUdp = (socket, message, rinfo) => {
    console.log('UDP message received:', message, 'from', rinfo.address, rinfo.port);
    const parse = getDeviceIdAndSerialNumber(message);
    console.log('parse:', parse);
};

module.exports = {handleUdp}