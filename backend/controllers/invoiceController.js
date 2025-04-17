const nodemailer = require('nodemailer');

const sendInvoice = async (req, res) => {
  const { invoice, email } = req.body;
  
  if (!invoice || !email) {
    return res.status(400).json({ message: 'Invoice data and email are required.' });
  }


  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,        
    port: process.env.SMTP_PORT,        
    secure: process.env.SMTP_SECURE === 'true', 
    auth: {
      user: process.env.SMTP_USER,      
      pass: process.env.SMTP_PASS       
    }
  });

  try {
    
    
    const base64Data = invoice.split(',')[1];
    const invoiceBuffer = Buffer.from(base64Data, 'base64');

    const mailOptions = {
      from: process.env.EMAIL_FROM,        
      to: email,                           
      subject: 'Your Invoice from Adventure Gear',
      text: 'Please find attached your invoice.',
      html: '<p>Please find attached your invoice.</p>',
      attachments: [
        {
          filename: 'invoice.pdf',
          content: invoiceBuffer,
          contentType: 'application/pdf'
        }
      ]
    };

    let info = await transporter.sendMail(mailOptions);
    console.log('Invoice email sent: %s', info.messageId);
    res.json({ message: 'Invoice sent successfully!' });
  } catch (error) {
    console.error('Error sending invoice email:', error);
    res.status(500).json({ message: 'Failed to send invoice.' });
  }
};

module.exports = { sendInvoice };
