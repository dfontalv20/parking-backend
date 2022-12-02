const { DataTypes } = require("sequelize");
const database = require(".");
const Client = require("./Client.model");
const Movement = require("./Movement.model");

const Slot = database.define('slot', {
    number: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, { paranoid: true })

Slot.belongsTo(Client)

module.exports = Slot