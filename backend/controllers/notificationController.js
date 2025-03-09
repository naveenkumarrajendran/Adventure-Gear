const nodemailer = require('nodemailer');


const sendReceipt = async (req, res) => {
  const { email, paymentIntentId, amountPaid, orderId } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS, 
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,  
    to: email, 
    subject: 'Your Order Receipt',
    text: `Thank you for your purchase! Your payment of $${amountPaid} was successful. 
    Payment Intent ID: ${paymentIntentId}. Order ID: ${orderId}.`,
  };

  try {
    await transporter.sendMail(mailOptions); 
    res.json({ success: true, message: 'Receipt sent successfully' });
  } catch (error) {
    console.error('Error sending receipt:', error);
    res.status(500).json({ success: false, message: 'Failed to send receipt' });
  }
};

module.exports = {
  sendReceipt,
};
