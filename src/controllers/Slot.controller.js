const { Router, request, response } = require("express")
const Client = require("../models/Client.model")
const Movement = require("../models/Movement.model")
const Slot = require("../models/Slot.model")
const parkingRequestSchema = require("../schemas/ParkRequest")
const slotSchema = require("../schemas/Slot")
const { requestValidation } = require("../utils/request")

class SlotController {

    routes() {
        const router = Router()
        router.route('/slot')
            .get(this.getAll)
            .post(requestValidation(slotSchema), this.uniqueNumber, this.clientExists, this.create)
        router.route('/slot/:id/occupy')
            .post(requestValidation(parkingRequestSchema), this.slotExists, this.validateReservation, this.occupySlot)
        router.route('/slot/:id/vacate')
            .post(this.slotExists, this.vacateSlot)
        router.route('/slot/:id')
            .put(requestValidation(slotSchema), this.slotExists, this.clientExists, this.update)
            .delete(this.slotExists, this.delete)
        return router
    }

    getAll = async (req = request, res = response) => {
        try {
            let slots = await Slot.findAll({ include: [Client] })
            slots = await Promise.all(slots.map(async (slot) => ({
                ...slot.dataValues, current: (await this.currentParking(slot))?.dataValues ?? null
            })))
            res.status(200).json(slots)
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

    vacateSlot = async (req = request, res = response) => {
        try {
            const slotMovement = await this.currentParking(await Slot.findByPk(+req.params.id))
            if (!slotMovement) {
                return res.status(400).json({
                    error: 'Esta plaza se encuentra desocupada'
                })
            }
            slotMovement.update({
                exitDate: new Date()
            })
            res.status(200).json()
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

    occupySlot = async (req = request, res = response) => {
        try {
            const isSlotOccuped = await this.currentParking(await Slot.findByPk(+req.params.id)) != null
            if (isSlotOccuped) {
                return res.status(400).json({
                    error: 'Esta plaza se encuentra ocupada'
                })
            }
            const movement = await Movement.create({
                ...req.body,
                entryDate: new Date()
            })
            res.status(200).json(movement)
        } catch (error) {
            console.error(error)
            return res.status(500).send()
        }
    }

    currentParking = async (slot = new Slot()) => {
        return (await Movement.findOne({
            order: [
                ['entryDate', 'DESC']
            ],
            where:
            {
                slotId: slot.id,
                exitDate: null
            },
        }))
    }

    validateReservation = async (req = request, res = response, next) => {
        const { personName } = req.body
        const { id } = req.params
        try {
            const { client } = await Slot.findOne({ where: { id }, include: [Client] })
            if (client.name != personName) {
                return res.status(400).json({
                    error: `Esta plaza esta reservada`
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