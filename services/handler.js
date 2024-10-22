const { getDeviceIdAndSerialNumber } = require("./parser");
const { checkSerialNumber, savePayload } = require("./save");

const handleUdp = async (socket, message, rinfo) => {
    const parse = getDeviceIdAndSerialNumber(message);
    const serialNumber = parse.deviceId.toString('hex');
    console.log('serial_number: ', serialNumber);

    const deviceId = await checkSerialNumber(serialNumber);
    if (deviceId) {
        console.log(`Device ID found: ${deviceId}, saving payload...`);
        await savePayload(deviceId,serialNumber, message);
    } else {
        console.log(`Device with serial_number ${serialNumber} not found`);
    }
};

module.exports = {handleUdp}