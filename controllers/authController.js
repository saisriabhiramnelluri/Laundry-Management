const Student = require('../models/Student');
const Manager = require('../models/Manager');
const bcrypt = require('bcryptjs');

exports.studentLoginForm = (req, res) => {
    res.render('student/login', { title: 'Student Login' });
};

exports.studentLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const student = await Student.findOne({ email });

        if (!student || !(await bcrypt.compare(password, student.password))) {
            req.flash('error', 'Invalid credentials');
            return res.redirect('/student/login');
        }

        req.session.user = { 
            _id: student._id, 
            role: 'student', 
            name: student.name,
            email: student.email
        };
        req.flash('success', 'Logged in successfully');
        res.redirect('/student/dashboard');
    } catch (error) {
        console.error('Login error:', error);
        req.flash('error', 'Login failed');
        res.redirect('/student/login');
    }
};

exports.managerLoginForm = (req, res) => {
    res.render('manager/login', { title: 'Manager Login' });
};

exports.managerLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const manager = await Manager.findOne({ email });

        if (!manager || !(await bcrypt.compare(password, manager.password))) {
            req.flash('error', 'Invalid credentials');
            return res.redirect('/manager/login');
        }

        req.session.user = { 
            _id: manager._id, 
            role: 'manager', 
            name: manager.name,
            email: manager.email
        };
        req.flash('success', 'Logged in successfully');
        res.redirect('/manager/dashboard');
    } catch (error) {
        console.error('Login error:', error);
        req.flash('error', 'Login failed');
        res.redirect('/manager/login');
    }
};

exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
        }
        res.redirect('/');
    });
};
