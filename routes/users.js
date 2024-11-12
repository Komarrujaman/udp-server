'use strict';

const { getAll, create, remove } = require('../services/user');
const { login, verifyToken } = require('../services/Auth');
const { message } = require('../services/listener');

module.exports = async function (fastify) {
  fastify.get('/users', async (req, res) => {
    return { data: await getAll() };
  });

  fastify.post('/users/create', async (req, res) => {
    const body = req.body;
    console.log("data: ", body);
    const newUser = await create(body);

    return {
      message: 'User created successfully',
      user: newUser
    }
  });

  fastify.delete('/users/delete/:id', async (req, res) => {
    const { id } = req.params;
    await remove(id);

    return {
      message: 'User deleted successfully'
    };
  });

  fastify.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    try {
      const { token } = await login(email, password);
      return {
        message: 'Login successful',
        token
      };
    } catch (err) {
      res.status(401).send({
        message: err.message || 'Authentication failed',
      });
    }
  });

  fastify.get('/check-token', { preHandler: verifyToken }, async (req, reply) => {
    reply.status(200).send({ message: 'Token is valid' });
  });
}