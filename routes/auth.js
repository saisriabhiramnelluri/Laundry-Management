const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/student/login', authController.studentLoginForm);
router.post('/student/login', authController.studentLogin);

router.get('/manager/login', authController.managerLoginForm);
router.post('/manager/login', authController.managerLogin);

router.get('/logout', authController.logout);

module.exports = router;
