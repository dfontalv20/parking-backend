const { Router, request, response } = require("express")
const Client = require("../models/Client.model")
const Slot = require("../models/Slot.model")
const clientSchema = require("../schemas/Client")
const slotSchema = require("../schemas/Slot")
const { requestValidation } = require("../utils/request")

class SlotController {

    routes() {
        const router = Router()
        router.route('/slot')
            .get(this.getAll)
            .post(requestValidation(slotSchema), this.uniqueNumber, this.clientExists, this.create)
        router.route('/slot/:id')
            .put(requestValidation(slotSchema), this.slotExists, this.clientExists, this.update)
            .delete(this.slotExists, this.delete)
        return router
    }

    async getAll(req = request, res = response) {
        try {
            res.status(200).json(await Slot.findAll())
        } catch (error) {
            console.error(error)
            return res.status(500).send()
        }
    }

    async create(req = request, res = response) {
        try {
            const client = await (new Slot(req.body)).save()
            res.status(201).json(client)
        } catch (error) {
            console.error(error)
            return res.status(500).send()
        }
    }

    async update(req = request, res = response) {
        try {
            const { id } = req.params
            const { number } = req.body
            const slotWithNumberExists = await Slot.findOne({ where: { number, id: { $not: id } } }) != null
            if (slotWithNumberExists) {
                return res.status(400).json({
                    error: 'Ya existe una plaza con este numero'
                })
            }
            const slot = await Slot.findByPk(+id)
            await slot.update(req.body)
            res.status(200).json(slot)
        } catch (error) {
            console.error(error)
            return res.status(500).send()
        }
    }

    async delete(req = request, res = response) {
        try {
            const { id } = req.params
            const slot = await Slot.findByPk(+id)
            await slot.destroy(req.body)
            res.status(200).json(slot)
        } catch (error) {
            console.error(error)
            return res.status(500).send()
        }
    }

    async uniqueNumber(req = request, res = response, next) {
        try {
            const { number } = req.body
            const slotWithNumberExits = await Slot.findOne({ where: { number } }) != null
            if (slotWithNumberExits) {
                return res.status(400).json({
                    error: 'Ya existe una plaza con este numero'
                })
            }
            next()
        } catch (error) {
            console.error(error)
            return res.status(500).send()
        }
    }

    async slotExists(req = request, res = response, next) {
        try {
            const { id } = req.params
            const slotExists = await Slot.findByPk(+id) != null
            if (!slotExists) {
                return res.status(404).send()
            }
            next()
        } catch (error) {
            console.error(error)
            res.status(500).send()
        }
    }

    async clientExists(req = request, res = response, next) {
        try {
            const { clientId } = req.body
            if (!clientId) {
                return next()
            }
            const clientExists = await Client.findByPk(+clientId) != null
            if (!clientExists) {
                return res.status(400).json({
                    error: 'Cliente no existe'
                })
            }
            next()
        } catch (error) {
            console.error(error)
            res.status(500).send()
        }
    }
}

module.exports = SlotController