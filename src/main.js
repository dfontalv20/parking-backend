const express = require('express')
const config = require('./config')
const app = express()
app.use(express.json())

app.get('/', (req, res) => res.send('Hello world'))

app.listen(config.appPort, () => console.log(`Server running in port ${config.appPort}...`))