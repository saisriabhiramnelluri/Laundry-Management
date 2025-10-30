const Joi = require('joi');

module.exports = Joi.object({
    name: Joi.string().required(),
    hostel: Joi.string().required(),
    roomNumber: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    password: Joi.string().min(5).when('$isUpdate', { is: false, then: Joi.required() }),
});
