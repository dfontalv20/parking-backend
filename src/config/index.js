const env = require('dotenv')
env.config()

module.exports = {
    dbHost: process.env.DB_HOST,
    dbPort: process.env.DB_PORT,
    dbUser: process.env.DB_USER,
    dbPass: process.env.DB_PASS,
    appPort: process.env.APP_PORT,
}