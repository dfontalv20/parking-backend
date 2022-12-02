const Joi = require("joi");

const slotSchema = Joi.object({
    number: Joi.number().integer().required(),
    clientId: Joi.number().integer().positive().allow(null).required()
})

module.exports = slotSchema