// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminUsersController = require('../controllers/adminUsersController');



/**
 * GET /admin/users => returns all users
 */
router.get('/users',
  
  adminUsersController.getAllUsers
);

/**
 * GET /admin/users/:id => returns a single user by ID
 */
router.get('/users/:id',
  
  adminUsersController.getUserById
);

/**
 * POST /admin/users => create a new user
 */
router.post('/users',
  
  adminUsersController.createUser
);

/**
 * PUT /admin/users/:id => update user
 */
router.put('/users/:id',
  
  adminUsersController.updateUser
);

/**
 * DELETE /admin/users/:id => remove user
 */
router.delete('/users/:id',
 
  adminUsersController.deleteUser
);

module.exports = router;
