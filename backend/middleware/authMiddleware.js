const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateJWT = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      console.log('No Authorization header present');
      return res.status(401).json({ message: 'Unauthorized - No token provided' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      console.log('No token found in Authorization header');
      return res.status(401).json({ message: 'Unauthorized - No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded Token:', decoded);

  
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      console.log('User not found in database');
      return res.status(401).json({ message: 'Unauthorized - User not found' });
    }

    console.log('Authenticated User:', req.user);
    next();
  } catch (error) {
    console.error('JWT Authentication Error:', error);
    res.status(403).json({ message: 'Forbidden - Invalid Token' });
  }
};


const authorizeRoles = (...roles) => (req, res, next) => {
  console.log('Checking user role:', req.user?.role);
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden - Insufficient permissions' });
  }
  next();
};


module.exports = { authenticateJWT, authorizeRoles };

