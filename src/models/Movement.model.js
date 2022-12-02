const { DataTypes } = require("sequelize");
const database = require(".");
const Slot = require("./Slot.model");

const Movement = database.define('movement', {
    car: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    entryDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    exitDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    personName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    plate: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    color: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, { paranoid: true, updatedAt: false, createdAt: false })

Movement.belongsTo(Slot)

module.exports = Movement