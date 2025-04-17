// controllers/adminOrdersController.js
const Order = require('../models/Order');


const getAllOrdersForAdmin = async (req, res) => {
  try {
  
    const orders = await Order.find()
      .populate('orderItems.productId', 'name price')
      .populate('userId', 'name email');
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};


const updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    order.status = status;
    await order.save();
    res.json({ message: 'Order status updated successfully', order });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Failed to update order status' });
  }
};

module.exports = { getAllOrdersForAdmin, updateOrderStatus };
