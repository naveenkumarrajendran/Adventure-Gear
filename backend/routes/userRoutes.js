const express = require('express');
const router = express.Router();

const {
    getUserProfile,
    updateUserProfile,
} = require('../controllers/userController');

const {
    authenticateJWT,
} = require('../middleware/authMiddleware');

router.get('/profile', authenticateJWT, getUserProfile);
router.put('/profile', authenticateJWT, updateUserProfile);

module.exports = router;