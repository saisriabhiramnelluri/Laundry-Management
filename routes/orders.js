const express = require('express');
const router = express.Router();
const { isStudent } = require('../middleware/auth');
const orderController = require('../controllers/orderController');

router.get('/:id', isStudent, orderController.showOrder);

module.exports = router;
