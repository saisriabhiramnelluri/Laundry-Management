const Joi = require('joi');

module.exports = Joi.object({
    clothesCount: Joi.number().integer().min(1).max(50).required(),
    notes: Joi.string().max(200).allow('').optional(),
});
