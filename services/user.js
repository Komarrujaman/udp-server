const bcrypt = require('bcryptjs');
const { read, insert, update, remove } = require("../config/db");
const { generateToken, verifyToken } = require("./Auth")

function _readById(id) {
  return read(`SELECT * FROM user WHERE id = ?;`, [id]);
}

function _readByUsername(username) {
  return read(`SELECT username, email, password, role FROM user WHERE username = ?;`, [username]);
}

module.exports.getAll = () => {
  return read(`SELECT id, username, role FROM user;`);
}

module.exports.create = async (body) => {
  const id = new Date().toISOString();
  const data = body;
  const xbody = {
    id: id,
    username: data.username,
    email: data.email,
    password: data.password,
    role: data.role,
  }

  const existing = await _readByUsername(data.username);
  if (existing && existing.length > 0) throw new Error('User with the same username already exists.');

  const hashedPassword = await bcrypt.hash(xbody.password, 10);
  xbody.password = hashedPassword;

  const insertResult = await insert(
    `INSERT INTO user (id, username, email, password, role) VALUES (?, ?, ?, ?, ?);`,
    [xbody.id, xbody.username, xbody.email, xbody.password, xbody.role] // Provide values as an array
  );
  const newUser = await read(`SELECT id, username, password, role from user where id = ?`, [xbody.id]);
  
  const token = generateToken(newUser[0].id, newUser[0].username, newUser[0].role);

  return {
    user: newUser[0],
    token: token
  };
}

module.exports.remove = async (id) => {
  const res = await _readById(id);
  if (!res || res.length === 0) throw new Error('No user found.');
  return remove(`DELETE FROM user WHERE id = ?;`, [id]);
}