// controllers/adminUsersController.js
const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash');
    return res.status(200).json(users);
  } catch (err) {
    console.error('getAllUsers error:', err);
    return res.status(500).json({ message: 'Failed to fetch users' });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json(user);
  } catch (err) {
    console.error('getUserById error:', err);
    return res.status(500).json({ message: 'Failed to fetch user' });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, role, password } = req.body;

  
    const newUser = await User.create({
      name,
      email,
      role: role || 'user',
      passwordHash: password 
    });
    return res.status(201).json({ message: 'User created', user: newUser });
  } catch (err) {
    console.error('createUser error:', err);
    return res.status(500).json({ message: 'Failed to create user' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { name, role } = req.body;
   
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { name, role },
      { new: true }
    ).select('-passwordHash');
    if (!updated) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json({ message: 'User updated', user: updated });
  } catch (err) {
    console.error('updateUser error:', err);
    return res.status(500).json({ message: 'Failed to update user' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json({ message: 'User deleted' });
  } catch (err) {
    console.error('deleteUser error:', err);
    return res.status(500).json({ message: 'Failed to delete user' });
  }
};
