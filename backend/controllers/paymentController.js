const Stripe = require('stripe');

const Transaction = require('../models/Transaction');

const stripe=Stripe(process.env.STRIPE_SECRET_KEY);

    const createPaymentIntent = async (req, res) => {
        const { totalPrice } = req.body;
      
        try {
          const paymentIntent = await stripe.paymentIntents.create({
            amount: totalPrice * 100, 
            currency: 'cad', 
            payment_method_types: ['card'],
          });
      
          res.status(200).json({
            clientSecret: paymentIntent.client_secret,
          });
        } catch (error) {
          console.error('Error creating payment intent:', error);
          res.status(500).send('Internal Server Error');
        }
      };
      

      const saveTransaction = async (req, res) => {
        const { paymentIntentId, amountPaid, currency, status, customerId, paymentMethod } = req.body;
      
        try {
          const transaction = new Transaction({
            paymentIntentId,
            amountPaid,
            currency,
            status,
            customerId,
            paymentMethod,
          });
      
          await transaction.save();  
      
          res.json({ message: 'Transaction saved successfully' });
        } catch (error) {
          console.error('Error saving transaction:', error);
          res.status(500).json({ message: 'Server error' });
        }
      };
      

      module.exports = { createPaymentIntent,saveTransaction };