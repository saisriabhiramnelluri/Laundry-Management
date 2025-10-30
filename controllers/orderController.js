const Order = require('../models/Order');

exports.showOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('student')
            .populate('statusHistory.updatedBy', 'name');
        
        if (!order || order.student._id.toString() !== req.session.user._id) {
            req.flash('error', 'Order not found');
            return res.redirect('/student/orders');
        }
        
        res.render('student/order-detail', { 
            title: 'Order Details',
            order, 
            user: req.session.user 
        });
    } catch (error) {
        console.error('Order detail error:', error);
        req.flash('error', 'Failed to load order details');
        res.redirect('/student/orders');
    }
};
