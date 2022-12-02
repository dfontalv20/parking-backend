const Application = require('./server/Application')
const database  = require("./models")
const ClientController = require('./controllers/Client.controller')
const SlotController = require('./controllers/Slot.controller')

new Application({
    database,
    models: {
        Client: require("./models/Client.model"),
        Slot: require("./models/Slot.model"),
    },
    controllers: [
        new ClientController(),
        new SlotController(),
    ]
})