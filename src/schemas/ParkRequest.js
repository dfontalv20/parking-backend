const Joi = require("joi");

const parkingRequestSchema = Joi.object({
    car: Joi.string().required(),
    personName: Joi.string().required(),
    phone: Joi.number().integer().required(),
    plate: Joi.string().required(),
    slotId: Joi.number().integer().required(),
})

module.exports = parkingRequestSchema