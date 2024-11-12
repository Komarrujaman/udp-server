const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { read, insert, update, remove } = require("../config/db");

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

module.exports.generateToken = (userId, username, role) => {
  const payload = { userId, username, role };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }); // Token expires in 1 hour
};

module.exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ message: "Authorization header missing" });
  }

  const token = authHeader.split(' ')[1]; 
  console.log("token : ", token)
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Invalid token" });
    }
    req.user = decoded; // Simpan data yang di-decode ke `req.user`
    next();
  });
};

module.exports.login = async (email, password) => {
  const user = await read(`SELECT id, username, email, password, role FROM user WHERE email = ?;`, [email]);
  if (!user || user.length === 0) throw new Error('User not found.');

  const validPassword = await bcrypt.compare(password, user[0].password);
  if (!validPassword) throw new Error('Invalid credentials.');

  const token = jwt.sign(
    { id: user[0].id, username: user[0].username, role: user[0].role },
    JWT_SECRET, 
    { expiresIn: '1h' }
  );

  return { token };
};
