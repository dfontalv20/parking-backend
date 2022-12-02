const config = require("../config")
const express = require("express")

class Application {
    app = express()
    database
    models = {}
    controllers = []

    constructor({ database, models, controllers }) {
        this.database = database;
        this.models = models;
        this.controllers = controllers;
        (async () => {
            this.setupMiddlewares()
            this.setupRoutes()
            await this.setupDatabase()
            this.startServer()
        })()
    }

    setupMiddlewares() {
        this.app.use(express.json())
    }

    async setupDatabase() {
        try {
            await this.database.authenticate()
            this.setupModels()
            await this.database.sync()
        } catch (error) {
            console.error('Error connecting to database', error);
        }
    }

    setupModels() {
        for (const [modelName, model] of Object.entries(this.models)) {
            this.database[modelName] = model
        }
    }

    setupRoutes() {
        this.app.get('/', (req, res) => res.send('Hello world'))
    }

    setupRoutes() {
        this.controllers.forEach(controller => {
            this.app.use(controller.routes())
        })
    }

    startServer() {
        this.app.listen(config.appPort, () => console.log('Server started'))
    }
}

module.exports = Application