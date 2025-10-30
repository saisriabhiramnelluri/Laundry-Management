const express = require('express');
const router = express.Router();
const { isStudent } = require('../middleware/auth');
const studentController = require('../controllers/studentController');

router.get('/dashboard', isStudent, studentController.dashboard);
router.get('/create-order', isStudent, studentController.createOrderForm);
router.post('/create-order', isStudent, studentController.createOrder);
router.get('/orders', isStudent, studentController.orderHistory);
router.get('/profile', isStudent, studentController.profileForm);
router.post('/profile', isStudent, studentController.updateProfile);

module.exports = router;
