
const bcrypt    = require('bcrypt');
const jwt       = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const qrcode    = require('qrcode');

const User = require('../models/User'); // Mongoose user model

function generateJWT(user) {
  const payload = { id: user._id, role: user.role };
  console.log('[generateJWT] Creating token with payload:', payload);
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
}

/* ============================================================================
   1) REGISTER USER: create + generate TOTP secret + return QR code
============================================================================ */
exports.registerUser = async (req, res) => {
  console.log('[registerUser] Called with body:', req.body);
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      console.log('[registerUser] Missing fields => 400');
      return res.status(400).json({ message: 'Missing required fields' });
    }

   
    console.log('[registerUser] Checking if email exists:', email);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('[registerUser] Email already registered => 400');
      return res.status(400).json({ message: 'Email already registered' });
    }


    console.log('[registerUser] Hashing password');
    const hashedPassword = await bcrypt.hash(password, 10);

    
    console.log('[registerUser] Creating user in DB...');
    const newUser = await User.create({
      name,
      email,
      passwordHash: hashedPassword,
      role: role || 'user',
      twoFactorSecret: null,
      twoFactorEnabled: false,
    });
    console.log('[registerUser] Created user:', newUser);


    console.log('[registerUser] Generating TOTP secret with speakeasy');
    const secret = speakeasy.generateSecret({
      name: `AdventureGear (${email})`,
    });
    console.log('[registerUser] TOTP secret generated. base32:', secret.base32);

    newUser.twoFactorSecret = secret.base32;
    await newUser.save();
    console.log('[registerUser] Saved user with secret:', newUser._id);

 
    const otpauthURL = secret.otpauth_url;
    console.log('[registerUser] Converting otpauthURL to QR data URL...');
    const qrDataURL = await qrcode.toDataURL(otpauthURL);

    console.log('[registerUser] Registration success => returning 201');
    return res.status(201).json({
      message: 'Registration successful. Scan QR in Microsoft Authenticator and verify code.',
      user: {
        _id: newUser._id,
        email: newUser.email,
        role: newUser.role,
        twoFactorEnabled: newUser.twoFactorEnabled,
      },
      qrDataURL,
      otpauthURL,
    });
  } catch (err) {
    console.error('[registerUser] Error:', err);
    return res.status(500).json({ message: 'Server error registering user.' });
  }
};


exports.verifyTOTP = async (req, res) => {
  console.log('[verifyTOTP] Called with body:', req.body);
  try {
    const { email, token } = req.body; 
    if (!email || !token) {
      console.log('[verifyTOTP] Missing email or token => 400');
      return res.status(400).json({ message: 'Email and TOTP code are required' });
    }

    
    console.log('[verifyTOTP] Finding user by email:', email);
    const user = await User.findOne({ email });
    if (!user) {
      console.log('[verifyTOTP] User not found => 404');
      return res.status(404).json({ message: 'User not found' });
    }
    if (!user.twoFactorSecret) {
      console.log('[verifyTOTP] No twoFactorSecret => 400');
      return res.status(400).json({ message: 'No TOTP secret. Re-register or enable 2FA first.' });
    }

 
    console.log('[verifyTOTP] Verifying TOTP code with speakeasy');
    const isValid = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token,
      window: 1, 
    });
    console.log('[verifyTOTP] TOTP code valid?', isValid);
    if (!isValid) {
      console.log('[verifyTOTP] TOTP invalid => 400');
      return res.status(400).json({ message: 'Invalid or expired TOTP code' });
    }


    user.twoFactorEnabled = true;
    await user.save();
    console.log('[verifyTOTP] 2FA enabled for user:', user._id);

    return res.json({
      message: 'TOTP verified. 2FA enabled for this account.',
      twoFactorEnabled: true,
    });
  } catch (err) {
    console.error('[verifyTOTP] Error:', err);
    return res.status(500).json({ message: 'Server error verifying TOTP.' });
  }
};


exports.loginUser = async (req, res) => {
  console.log('[loginUser] Called with body:', req.body);
  try {
    const { email, password, token } = req.body;
    console.log('[loginUser] Looking up user by email:', email);
    const user = await User.findOne({ email });
    if (!user) {
      console.log('[loginUser] User not found => 401');
      return res.status(401).json({ message: 'Invalid credentials (user not found)' });
    }

    
    console.log('[loginUser] Checking password via bcrypt.compare');
    const pwMatch = await bcrypt.compare(password, user.passwordHash);
    console.log('[loginUser] Password match?', pwMatch);
    if (!pwMatch) {
      console.log('[loginUser] Bad password => 401');
      return res.status(401).json({ message: 'Invalid credentials (bad password)' });
    }

    
    console.log('[loginUser] twoFactorEnabled =', user.twoFactorEnabled);
    if (user.twoFactorEnabled) {
      if (!token) {
        console.log('[loginUser] 2FA is on, but no token => 400');
        return res.status(400).json({ message: 'TOTP code required (2FA enabled)' });
      }
      console.log('[loginUser] Verifying TOTP code with speakeasy');
      const codeOK = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: 'base32',
        token,
        window: 1,
      });
      console.log('[loginUser] TOTP code valid?', codeOK);
      if (!codeOK) {
        console.log('[loginUser] TOTP invalid => 400');
        return res.status(400).json({ message: 'Invalid TOTP code' });
      }
    }

   
    console.log('[loginUser] All checks out => signing JWT');
    const jwtToken = generateJWT(user);

    console.log('[loginUser] Returning success for user', user._id);
    return res.json({
      message: 'Login successful.',
      token: jwtToken,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        twoFactorEnabled: user.twoFactorEnabled,
      },
    });
  } catch (err) {
    console.error('[loginUser] Error:', err);
    return res.status(500).json({ message: 'Server error logging in.' });
  }
};


exports.logoutUser = (_req, res) => {
  console.log('[logoutUser] Called => returning message');
  return res.json({ message: 'Logged out. Client should remove token.' });
};


exports.getMe = async (req, res) => {
  console.log('[getMe] Called for user:', req.user.id);
  try {
    const user = await User.findById(req.user.id).select('-passwordHash -twoFactorSecret');
    if (!user) {
      console.log('[getMe] user not found => 404');
      return res.status(404).json({ message: 'User not found' });
    }
    console.log('[getMe] Found user => returning data');
    return res.json(user);
  } catch (err) {
    console.error('[getMe] Error:', err);
    return res.status(500).json({ message: 'Server Error' });
  }
};
