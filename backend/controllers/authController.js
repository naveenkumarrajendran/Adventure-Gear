const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const twilio = require('twilio');

const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const registerUser = async (req, res) => {
  try {
    console.log("Register request body:", req.body);
    const { name, email, password, address, role, phoneNumber } = req.body;

    if (!name || !email || !password || !phoneNumber) {
      console.log("Missing required fields");
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("Email already registered");
      return res.status(400).json({ message: 'Email already registered' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      passwordHash: hashedPassword,
      address,
      role,
      phoneNumber
    });

    await newUser.save();
 
    console.log("Request body received:", req.body);
    console.log("User registered successfully",newUser);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password, phoneNumber } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }


    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.phoneNumber) {
      if (!phoneNumber) {
        return res.status(400).json({ message: 'Phone number is required for MFA' });
      }
      
      user.phoneNumber = phoneNumber;
      await user.save();
    }

    
    const otp = Math.floor(100000 + Math.random() * 900000); 
    
    const formattedPhoneNumber = `+1${user.phoneNumber}`;

    console.log('Formatted phone number:', formattedPhoneNumber);

    await client.messages.create({
      body: `Your OTP is: ${otp}`,
      from: twilioPhoneNumber,
      to: formattedPhoneNumber, 
    });

  
    user.otp = otp;
    user.otpCreatedAt = Date.now();
    await user.save();

    return res.json({
      message: 'OTP sent to your phone. Please verify to continue.',
      otpRequired: true,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ message: 'User not found' });
    }

    const otpExpiryTime = 5 * 60 * 1000; 
    if (Date.now() - user.otpCreatedAt > otpExpiryTime) {
      console.log('OTP expired for:', email);
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    if (user.otp !== parseInt(otp)) { 
      console.log('Invalid OTP entered for:', email);
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    const payload = {
      id: user._id,
      role: user.role,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    user.otp = null;
    user.otpCreatedAt = null;
    await user.save();

    res.json({ token, user });
  } catch (error) {
    console.error('Error in verifyOTP:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};



const logoutUser = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash'); 
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { registerUser, loginUser, verifyOTP ,logoutUser, getMe };