'use strict';
const { getAll, getBySerialNumber } = require('../services/data');

module.exports = async function (fastify) {
    fastify.get('/data/:serial_number', async (req, res) => {
        const {serial_number} = req.params;
        return {data: await getBySerialNumber(serial_number)};
    });

    fastify.get('/datas', async (req, res) => {
        return {data: await getAll()}
    });
}