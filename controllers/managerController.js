const Order = require('../models/Order');
const Student = require('../models/Student');

exports.dashboard = async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const pendingOrders = await Order.countDocuments({ status: 'pending' });
        const completedOrders = await Order.countDocuments({ status: 'completed' });
        const recentOrders = await Order.find()
            .populate('student', 'name hostel roomNumber')
            .sort({ createdAt: -1 })
            .limit(10);

        const statusData = await Order.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);

        res.render('manager/dashboard', {
            title: 'Manager Dashboard',
            user: req.session.user,
            totalOrders,
            pendingOrders,
            completedOrders,
            recentOrders,
            statusData
        });
    } catch (error) {
        console.error('Manager dashboard error:', error);
        req.flash('error', 'Failed to load dashboard');
        res.redirect('/manager/login');
    }
};

exports.scanQRForm = (req, res) => {
    res.render('manager/scan-qr', { 
        title: 'Scan QR Code',
        user: req.session.user 
    });
};

exports.scanQR = async (req, res) => {
    try {
        const { qrData } = req.body;
        const orderData = JSON.parse(qrData);
        
        const order = await Order.findOne({ orderId: orderData.orderId })
            .populate('student', 'name hostel roomNumber phone');
        
        if (!order) {
            req.flash('error', 'Order not found');
            return res.redirect('/manager/scan-qr');
        }

        res.render('manager/order-details', { 
            title: 'Order Details',
            order, 
            user: req.session.user,
            scannedData: orderData
        });
    } catch (error) {
        console.error('QR scan error:', error);
        req.flash('error', 'Invalid QR code');
        res.redirect('/manager/scan-qr');
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        
        const order = await Order.findOneAndUpdate(
            { orderId },
            { 
                status,
                $push: {
                    statusHistory: {
                        status,
                        timestamp: new Date(),
                        updatedBy: req.session.user._id
                    }
                }
            },
            { new: true }
        );

        if (!order) {
            req.flash('error', 'Order not found');
            return res.redirect('/manager/dashboard');
        }

        req.flash('success', `Order status updated to ${status}`);
        res.redirect('/manager/dashboard');
    } catch (error) {
        console.error('Status update error:', error);
        req.flash('error', 'Failed to update order status');
        res.redirect('/manager/dashboard');
    }
};

exports.searchOrders = async (req, res) => {
    try {
        const { query, searchType } = req.query;
        let orders = [];

        if (query && searchType) {
            if (searchType === 'orderId') {
                orders = await Order.find({ 
                    orderId: { $regex: query, $options: 'i' } 
                }).populate('student');
            } else if (searchType === 'studentName') {
                const students = await Student.find({
                    name: { $regex: query, $options: 'i' }
                });
                const studentIds = students.map(s => s._id);
                orders = await Order.find({
                    student: { $in: studentIds }
                }).populate('student');
            }
        }

        res.render('manager/search-results', {
            title: 'Search Results',
            user: req.session.user,
            orders,
            query,
            searchType
        });
    } catch (error) {
        console.error('Search error:', error);
        req.flash('error', 'Search failed');
        res.redirect('/manager/dashboard');
    }
};
