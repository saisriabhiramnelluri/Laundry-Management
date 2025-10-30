const Joi = require('joi');

exports.validateOrder = (req, res, next) => {
    const orderSchema = Joi.object({
        clothesCount: Joi.number().integer().min(1).max(50).required(),
        notes: Joi.string().max(200).allow('').optional(),
    });

    const { error } = orderSchema.validate(req.body);
    if (error) {
        req.flash('error', error.details.map(x => x.message).join(', '));
        return res.redirect('back');
    }
    next();
};

exports.validateUser = (req, res, next) => {
    const userSchema = Joi.object({
        name: Joi.string().required(),
        hostel: Joi.string().required(),
        roomNumber: Joi.string().required(),
        email: Joi.string().email().required(),
        phone: Joi.string().required(),
        password: Joi.string().min(5),
    });

    const { error } = userSchema.validate(req.body);
    if (error) {
        req.flash('error', error.details.map(x => x.message).join(', '));
        return res.redirect('back');
    }
    next();
};
