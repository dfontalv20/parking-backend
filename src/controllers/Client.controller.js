const { Router, request, response } = require("express")
const Client = require("../models/Client.model")
const clientSchema = require("../schemas/Client")
const { requestValidation } = require("../utils/request")

class ClientController {

    routes() {
        const router = Router()
        router.route('/client')
            .get(this.getAll)
            .post(requestValidation(clientSchema), this.uniqueName, this.create)
        router.route('/client/:id')
            .put(requestValidation(clientSchema), this.clientExists, this.update)
            .delete(this.clientExists, this.delete)
        return router
    }

    async getAll(req = this.server.app.request, res = this.server.app.response) {
        try {
            res.status(200).json(await Client.findAll())
        } catch (error) {
            console.error(error)
            return res.status(500).send()
        }
    }

    async create(req = request, res = response) {
        try {
            const client = await (new Client(req.body)).save()
            res.status(201).json(client)
        } catch (error) {
            console.error(error)
            return res.status(500).send()
        }
    }

    async update(req = request, res = response) {
        try {
            const { id } = req.params
            const { name } = req.body
            const clientWithNameExits = await Client.findOne({ where: { name, id: { $not: id } } }) != null
            if (clientWithNameExits) {
                return res.status(400).json({
                    error: 'Ya existe un cliente con este nombre'
                })
            }
            const client = await Client.findByPk(+id)
            await client.update(req.body)
            res.status(201).json(client)
        } catch (error) {
            console.error(error)
            return res.status(500).send()
        }
    }

    async delete(req = request, res = response) {
        try {
            const { id } = req.params
            const client = await Client.findByPk(+id)
            await client.destroy(req.body)
            res.status(200).json(client)
        } catch (error) {
            console.error(error)
            return res.status(500).send()
        }
    }

    async uniqueName(req = request, res = response, next) {
        try {
            const { name } = req.body
            const clientWithNameExits = await Client.findOne({ where: { name } }) != null
            if (clientWithNameExits) {
                return res.status(400).json({
                    error: 'Ya existe un cliente con este nombre'
                })
            }
            next()
        } catch (error) {
            console.error(error)
            return res.status(500).send()
        }
    }

    async clientExists(req = request, res = response, next) {
        try {
            const { id } = req.params
            const clientExists = await Client.findByPk(+id) != null
            if (!clientExists) {
                return res.status(404).send()
            }
            next()
        } catch (error) {
            console.error(error)
            res.status(500).send()
        }
    }
}

module.exports = ClientController