const express = require('express');
const router = express.Router();
const { isManager } = require('../middleware/auth');
const managerController = require('../controllers/managerController');

router.get('/dashboard', isManager, managerController.dashboard);
router.get('/scan-qr', isManager, managerController.scanQRForm);
router.post('/scan-qr', isManager, managerController.scanQR);
router.post('/update-status/:orderId', isManager, managerController.updateOrderStatus);
router.get('/search', isManager, managerController.searchOrders);

module.exports = router;
