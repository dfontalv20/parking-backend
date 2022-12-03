const Joi = require("joi");

const parkingRequestSchema = Joi.object({
    car: Joi.string().required(),
    personName: Joi.string().required(),
    phone: Joi.number().integer().required(),
    plate: Joi.string().required(),
    color: Joi.string().allow(null)
})

module.exports = parkingRequestSchema