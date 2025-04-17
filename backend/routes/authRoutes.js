// routes/authRoutes.js
const express = require('express');
const router  = express.Router();
const {
  registerUser,
  verifyTOTP,
  loginUser,
  logoutUser,
  getMe,
} = require('../controllers/authController');

const { authenticateJWT } = require('../middleware/authMiddleware');

// Register => returns QR code data URI
router.post('/register', registerUser);

// Verify TOTP => user enters 6-digit code
router.post('/verify-2fa', verifyTOTP);

// Login => might also require TOTP if user.twoFactorEnabled
router.post('/login', loginUser);

// Logout => stateless
router.post('/logout', logoutUser);

// Protected route example
router.get('/me', authenticateJWT, getMe);

module.exports = router;
