const { read, insert, update, remove } = require("../config/db");

function _readById(id) {
    return read(`SELECT * FROM device WHERE id = :id;`, { id });
}

function _readByName(serial_number) {
    return read(`SELECT id, serial_number, created_at, updated_at FROM device WHERE serial_number = :serial_number;`, { serial_number });
}

module.exports.getAll = () => {
    return read(`SELECT id, serial_number, created_at, updated_at FROM device WHERE deleted_at is NULL;`);
}

module.exports.getOne = async (id) => {
    const res = await _readById(id);
    if (!res || res.length === 0) return {};
    return res[0];
}

module.exports.getByName = async (serial_number) => {
    const res = await _readByName(serial_number);
    if (!res || res.length === 0) return {};
    return res[0];
}

module.exports.create = async (body) => {
    const now = new Date();
    const xbody = {
        serial_number: body.serial_number,
        created_at: now
    };
    const existing = await _readByName(body.serial_number);
    if (existing && existing.length > 0) throw new Error('Device with the same serial number already exists.');
    const insertResult = await insert(`INSERT INTO device (serial_number, created_at) VALUES (:serial_number, :created_at);`, xbody);
    const deviceId = insertResult[0];
    const newDevice = await read(`SELECT id, serial_number, created_at FROM device WHERE id = :device_id`, { device_id: deviceId });  
    return newDevice[0];
};

module.exports.update = async (id, body) => {
    const res = await _readById(id);
    if (!res || res.length === 0) throw new Error('No device found.');
    const resBody = res[0];
    const xbody = {
        id: resBody.id,
        serial_number: body.serial_number || resBody.serial_number,
    }
    const existing = await _readByName(body.serial_number);
    if (existing && existing.length > 0) throw new Error('Device with the same serial number already exists.');
    await update(`UPDATE device SET serial_number = :serial_number WHERE id = :id;`, xbody);
    const updateDevice = await read(`SELECT id, serial_number, created_at FROM device WHERE id = :device_id`, { device_id: resBody.id });
    return updateDevice[0];
}

module.exports.remove = async (id) => {
    const res = await _readById(id);
    if (!res || res.length === 0) throw new Error('No device found.');
    return remove(`DELETE FROM device WHERE id = :id;`, { id });
}
