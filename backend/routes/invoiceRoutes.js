// routes/invoiceRoutes.js
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// POST /api/send-invoice
router.post('/send-invoice', async (req, res) => {
  const { invoice, email } = req.body;
  if (!invoice || !email) {
    return res.status(400).json({ message: 'Missing invoice data or email.' });
  }
  try {
    
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
      subject: 'Your Invoice from Adventure Gear',
      text: 'Please find your invoice attached.',
      attachments: [
        {
          filename: 'invoice.pdf',
          content: invoice.split('base64,')[1],
          encoding: 'base64'
        }
      ]
    };

    
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Invoice sent to email successfully.' });
  } catch (error) {
    console.error('Error sending invoice email:', error);
    res.status(500).json({ message: 'Failed to send invoice email.' });
  }
});

module.exports = router;
