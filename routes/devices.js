'use strict';

const {getOne, getAll, getByName, create, update, remove} = require('../services/device');

module.exports = async function (fastify) {
    fastify.get('/devices', async (req, res) => {
        return {data: await getAll()}
    });

    fastify.get('/devices/:serial_number', async (req, res) => {
        const { serial_number } = req.params;
        return {data: await getByName(serial_number)}
    });

    fastify.post('/devices/create', async (req, res) => {
        const body = req.body.data;
        console.log(body);
        const newDevice = await create(body);
    
        return {
            message: "Device created successfully",
            device: newDevice
        };
    });

    fastify.put('/devices/update/:id', async (req, res) => {
        const { id } = req.params;
        const body = req.body;
        const updatedDevice = await update(id, body);
        
        return {
            message: "Device updated successfully",
            device: updatedDevice
        };
    });

    fastify.delete('/devices/delete/:id', async (req, res) => {
        const { id } = req.params;
        await remove(id);
        
        return {
            message: "Device deleted successfully"
        };
    });
}