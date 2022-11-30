const express = require('express')
const config = require('./config')
const { setupDatabaseConnection } = require('./config/db')
const app = express()
app.use(express.json())
setupDatabaseConnection()

app.get('/', (req, res) => res.send('Hello world'))

app.listen(config.appPort, () => console.log(`Server running in port ${config.appPort}...`))