const Order = require('../models/Order');
const Product = require('../models/Product');

const createOrder = async (req, res) => {
  try {
    const { orderItems } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No items in the order" });
    }

    let totalPrice = 0;

    for (const item of orderItems) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(400).json({ message: "Product not found" });
      }
      totalPrice += product.price * item.quantity;
    }

    if (isNaN(totalPrice)) {
      return res.status(400).json({ message: "Invalid totalPrice calculation" });
    }

    const order = new Order({
      orderItems,
      totalPrice,
      userId: req.user._id,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('orderItems.productId').populate('userId');
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};



const updateOrderStatus = async (req, res) => {
  const { orderId, status, paymentIntentId, amountPaid } = req.body;

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    
    order.status = status;  
    order.paymentIntentId = paymentIntentId;  
    order.amountPaid = amountPaid;  
    await order.save(); 

    res.json({ message: 'Order status updated successfully' });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



module.exports = {
  createOrder,
  getAllOrders,
  updateOrderStatus,
};
