const config = require('./index')
const { Sequelize } = require('sequelize')

const dbConnection = new Sequelize({
    dialect: 'mysql',
    host: config.dbHost,
    port: config.dbPort,
    username: config.dbUser,
    password: config.dbPass,
    logging: true
})

const setupDatabaseConnection = async () => {
    try {
        await dbConnection.authenticate()
        console.info('Database connected')
    } catch (error) {
        console.error('Error connecting to database')
        throw error
    }
}

module.exports = { dbConnection, setupDatabaseConnection }