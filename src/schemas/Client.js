const Joi = require("joi");

const clientSchema = Joi.object({
    name: Joi.string().required(),
    phone: Joi.number().required(),
    email: Joi.string().email().required()
})

module.exports = clientSchema