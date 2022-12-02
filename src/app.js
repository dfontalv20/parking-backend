const Application = require('./server/Application')
const database  = require("./models")
const ClientController = require('./controllers/Client.controller')

new Application({
    database,
    models: {
        Client: require("./models/Client.model")
    },
    controllers: [
        new ClientController()
    ]
})