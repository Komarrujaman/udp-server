const { read, insert } = require('../config/db');

// Fungsi untuk memeriksa apakah serial_number ada di tabel device
const checkSerialNumber = async (serialNumber) => {
    const sql = 'SELECT id FROM device WHERE serial_number = :serial_number';
    const result = await read(sql, { serial_number: serialNumber });

    // Jika serial_number ditemukan, kembalikan device_id-nya
    if (result.length > 0) {
        return result[0].id;
    }
    // Jika tidak ditemukan, kembalikan null
    return null;
};

// Fungsi untuk menyimpan payload ke tabel data
const savePayload = async (deviceId, serialNumber, payload) => {
    const now = new Date();
    const payloadHex = payload.toString('hex');
    const sql = `INSERT INTO data (device_id, serial_number, payload, created_at) VALUES (?, ?, ?, ?)`;
    const body = [deviceId, serialNumber, payloadHex, now];

    try {
        await insert(sql, body);
        console.log('Payload saved successfully');
    } catch (error) {
        console.error('Error saving payload:', error.message);
    }
};

module.exports = { checkSerialNumber, savePayload };
