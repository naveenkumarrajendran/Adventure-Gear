const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../middleware/authMiddleware');
const { getCartForUser, addItemToCart, removeItemFromCart, updateCartItemQuantity } = require('../controllers/cartController');

router.get('/me', authenticateJWT, getCartForUser);
router.post('/', authenticateJWT, addItemToCart);
router.delete('/:productId', authenticateJWT, removeItemFromCart);
router.put('/quantity', authenticateJWT, updateCartItemQuantity);

module.exports=router;