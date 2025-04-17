// paymentroutes.js
const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const { authenticateJWT } = require('../middleware/authMiddleware');
const Cart = require('../models/Cart'); 

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post('/create-payment-intent', authenticateJWT, async (req, res) => {
  try {
   
    const cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');
    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty.' });
    }

    const amount = cart.items.reduce((acc, item) => acc + item.productId.price * item.quantity, 0) * 100;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, 
      currency: 'cad',
      automatic_payment_methods: { enabled: true }, 
    });

   
    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
