const getDeviceIdAndSerialNumber = (message) => {
    const startIndex = 5;
    const hexLength = 7;
    const deviceId_tmp = [];
    const deviceId = [];
    for (let index = startIndex; index < startIndex + hexLength; index++) {
        deviceId_tmp.push(message[index]);
    }
    for (let index = hexLength - 1; index >= 0; index--) {
        deviceId.push(deviceId_tmp[index]);
    }
    return { deviceId: Buffer.from(deviceId) };
}

const getSessionId = (rinfo) => {
    return `${rinfo.address}_${rinfo.port}`;
}

const splitHex = (hexStr, lengthChar = 2) => {
    if (lengthChar === 1) {
        return hexStr.match(/.{1,1}/g);
    }
    return hexStr.match(/.{1,2}/g);
}

module.exports = { getDeviceIdAndSerialNumber, getSessionId, splitHex };