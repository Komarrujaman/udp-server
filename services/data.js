const { read } = require("../config/db");

async function _readBySerialNumber(serial_number) {
    const device = await read(`SELECT id FROM device WHERE serial_number = :serial_number;`, { serial_number });
    
    if (!device || device.length === 0) {
        throw new Error('Device not found.');
    }
    const device_id = device[0].id;
    return read(`SELECT * FROM data WHERE device_id = :device_id ORDER BY created_at DESC;`, { device_id });
}

module.exports.getBySerialNumber = async (serial_number) => {
    const res = await _readBySerialNumber(serial_number);
    if (!res || res.length === 0) return {};
    return res;
}