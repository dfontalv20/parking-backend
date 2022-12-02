const { Router, request, response } = require("express")
const Movement = require("../models/Movement.model")
const Slot = require("../models/Slot.model")

class MovementController {

    routes() {
        const router = Router()
        router.route('/movement')
            .get(this.getAll)
        router.route('/movement/:id')
            .delete(this.movementExists, this.delete)
        return router
    }

    async getAll(req = request, res = response) {
        try {
            res.status(200).json(await Movement.findAll({ include: [Slot] }))
        } catch (error) {
            console.error(error)
            return res.status(500).send()
        }
    }

    async delete(req = request, res = response) {
        try {
            const { id } = req.params
            const movement = await Movement.findByPk(+id)
            await movement.destroy(req.body)
            res.status(200).json(movement)
        } catch (error) {
            console.error(error)
            return res.status(500).send()
        }
    }

    async movementExists(req = request, res = response, next) {
        try {
            const { id } = req.params
            const movementExists = await Movement.findByPk(+id) != null
            if (!movementExists) {
                return res.status(404).send()
            }
            next()
        } catch (error) {
            console.error(error)
            res.status(500).send()
        }
    }
}

module.exports = MovementController