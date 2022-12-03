const { DataTypes } = require("sequelize");
const database = require(".");

const Client = database.define('client', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, { paranoid: true })

module.exports = Client