const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    paymentIntentId: {
      type: String,
      required: true, 
    },
    amountPaid: {
      type: Number,
      required: true,  
    },
    currency: {
      type: String,
      required: true,  
    },
    status: {
      type: String,
      required: true,  
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',  
      required: true,  
    },
    paymentMethod: {
      type: String,
      required: true,  
    },
    createdAt: {
      type: Date,
      default: Date.now,  
    },
  },
  { timestamps: true }  
);

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
