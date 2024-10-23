require('dotenv').config();

const Sequelize = require('sequelize');

const { UniqueConstraintError: UniqueConstraintErrorSequelize, DatabaseError: DatabaseErrorSequelize } = require('sequelize');

const DB_USER = process.env.DB_USER;
const DB_HOST = process.env.DB_HOST;
const DB_PASS = process.env.DB_PASS;
const DB_PORT = process.env.DB_PORT;
const DB_NAME = process.env.DB_NAME;

const URL = `mysql://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;

const sequelize = new Sequelize(URL, {
    dialect: 'mysql',
});

const catchError = function (error) {
    console.log("====== Catch Error ======");
    if (error instanceof UniqueConstraintErrorSequelize) {
        console.log("UniqueConstraintError");
        throw new Error("Duplicate Data. Please improve your data input");
    } else if (error instanceof DatabaseErrorSequelize) {
        console.log("DatabaseError");
        let message = error?.message;
        throw new Error(message);
    } else {
        console.log("Error Else");
        console.log(error);
        throw new Error(error?.message);
    }
};

const read = async function (sql, vinput) {
    try {
        return await sequelize.query(sql, { replacements: vinput, type: Sequelize.QueryTypes.SELECT });
    } catch (error) {
        return catchError(error);
    }
};

const insert = async function (sql, body) {
    try {
        return await sequelize.query(sql, { replacements: body, type: Sequelize.QueryTypes.INSERT });
    } catch (error) {
        return catchError(error);
    }
};

const update = async function (sql, body) {
    try {
        return await sequelize.query(sql, { replacements: body, type: Sequelize.QueryTypes.UPDATE });
    } catch (error) {
        return catchError(error);
    }
};

const remove = async function (sql, vinput) {
    try {
        return await sequelize.query(sql, { replacements: vinput, type: Sequelize.QueryTypes.DELETE });
    } catch (error) {
        return catchError(error);
    }
};

module.exports = { read, insert, update, remove };