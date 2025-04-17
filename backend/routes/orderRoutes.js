const express = require('express');
const router = express.Router();
const {
  createOrder,
  getAllOrders,
  updateOrderStatus,

} = require('../controllers/orderController');
const { authenticateJWT, authorizeRoles } = require('../middleware/authMiddleware');

const {authenticate} =require('../middleware/authMiddleware');

router.post('/', authenticateJWT, createOrder);
router.post('/orders/updateStatus', updateOrderStatus);


router.get('/admin', authenticateJWT, authorizeRoles('admin'), getAllOrders);
router.put('/:id/status', authenticateJWT, authorizeRoles('admin'), updateOrderStatus);

module.exports = router;
