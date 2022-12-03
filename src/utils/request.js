const { request, response } = require("express");
const Joi = require("joi");

const requestValidation = (schema = Joi.object()) => (req = request, res = response, next) => {
    const { error } = schema.validate(req.body)
    if (error) {
        return res.status(400).json({
            error: error.message
        })
    }
    next()
}

module.exports = { requestValidation }