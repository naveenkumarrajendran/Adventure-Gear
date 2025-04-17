const Transaction = require('../models/Transaction');

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

module.exports = { saveTransaction }; 