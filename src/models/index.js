const { Sequelize } = require('sequelize')
const config = require('../config')

const database = new Sequelize({
    dialect: 'mysql',
    host: config.dbHost,
    port: config.dbPort,
    username: config.dbUser,
    password: config.dbPass,
    database: config.dbName,
    logging: true
})

module.exports = database