const Student = require('../models/Student');
const Order = require('../models/Order');
const QRCode = require('qrcode');

exports.dashboard = async (req, res) => {
    try {
        const student = await Student.findById(req.session.user._id);
        const totalOrders = await Order.countDocuments({ student: student._id });
        const pendingOrders = await Order.countDocuments({ student: student._id, status: 'pending' });
        const completedOrders = await Order.countDocuments({ student: student._id, status: 'completed' });
        
        const recentOrders = await Order.find({ student: student._id })
            .sort({ createdAt: -1 })
            .limit(5);

        res.render('student/dashboard', {
            title: 'Student Dashboard',
            user: req.session.user,
            student,
            totalOrders,
            pendingOrders,
            completedOrders,
            recentOrders
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        req.flash('error', 'Failed to load dashboard');
        res.redirect('/student/login');
    }
};

exports.createOrderForm = (req, res) => {
    res.render('student/create-order', { 
        title: 'Create Order',
        user: req.session.user 
    });
};

exports.createOrder = async (req, res) => {
    try {
        const { clothesCount, notes } = req.body;
        const orderId = `LD${Date.now()}${Math.floor(Math.random() * 1000)}`;
        
        const student = await Student.findById(req.session.user._id);
        
        const orderData = {
            orderId,
            studentId: student._id,
            studentName: student.name,
            hostel: student.hostel,
            roomNumber: student.roomNumber,
            clothesCount: parseInt(clothesCount),
            notes,
            createdAt: new Date().toISOString()
        };
        
        const qrCodeDataUrl = await QRCode.toDataURL(JSON.stringify(orderData));
        
        const order = new Order({
            orderId,
            student: student._id,
            clothesCount: parseInt(clothesCount),
            notes,
            qrCode: qrCodeDataUrl
        });
        
        await order.save();
        
        await Student.findByIdAndUpdate(student._id, {
            $inc: { totalOrders: 1 },
            $set: { 
                lastOrderDate: new Date(),
                ...(student.totalOrders === 0 && { firstOrderDate: new Date() })
            }
        });
        
        req.flash('success', 'Order created successfully!');
        res.render('student/order-success', { 
            title: 'Order Success',
            order, 
            qrCode: qrCodeDataUrl, 
            user: req.session.user 
        });
    } catch (error) {
        console.error('Order creation error:', error);
        req.flash('error', 'Failed to create order');
        res.redirect('/student/create-order');
    }
};

exports.orderHistory = async (req, res) => {
    try {
        const { status, startDate, endDate } = req.query;
        let query = { student: req.session.user._id };
        
        if (status && status !== 'all') {
            query.status = status;
        }
        
        if (startDate && endDate) {
            query.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate + 'T23:59:59.999Z')
            };
        }
        
        const orders = await Order.find(query).sort({ createdAt: -1 });
        
        res.render('student/orders', {
            title: 'My Orders',
            user: req.session.user,
            orders,
            filters: { status, startDate, endDate }
        });
    } catch (error) {
        console.error('Orders error:', error);
        req.flash('error', 'Failed to load order history');
        res.redirect('/student/dashboard');
    }
};

exports.profileForm = async (req, res) => {
    try {
        const student = await Student.findById(req.session.user._id);
        res.render('student/profile', { 
            title: 'My Profile',
            student, 
            user: req.session.user 
        });
    } catch (error) {
        console.error('Profile error:', error);
        req.flash('error', 'Failed to load profile');
        res.redirect('/student/dashboard');
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { name, hostel, roomNumber, phone } = req.body;
        await Student.findByIdAndUpdate(req.session.user._id, {
            name, hostel, roomNumber, phone
        });
        
        req.session.user.name = name;
        
        req.flash('success', 'Profile updated successfully');
        res.redirect('/student/profile');
    } catch (error) {
        console.error('Profile update error:', error);
        req.flash('error', 'Failed to update profile');
        res.redirect('/student/profile');
    }
};
