const User = require('../models/User');
const OTP = require('../models/OTP');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'your_secret_key_change_this',
    { expiresIn: '7d' }
  );
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    // Create the user in the database
    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    // 🛑 THE FIX: We DO NOT generate a token here anymore!
    // Instead, we just tell the frontend that the account was created successfully.
    res.status(201).json({
      success: true,
      message: 'Account created successfully! Please log in to verify your email.',
    });
    
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error registering user', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    // Check if user is banned
    if (user.status === 'Banned' || user.status === 'Inactive' || user.status === 'banned') {
      return res.status(403).json({ success: false, message: 'Your account has been banned. You cannot log in.' });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    // 2FA: Generate OTP and send email
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await OTP.create({ email, otp });

    // Upgraded NodeMailer configuration
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"SkillBridge Security" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your SkillBridge Login Code',
      html: `<h2>Login Attempt Detected</h2>
             <p>Your two-factor authentication code is: <strong>${otp}</strong></p>
             <p>This code will expire in 5 minutes. Do not share it with anyone.</p>`,
    });

    res.status(200).json({
      success: true,
      message: 'Password verified. OTP sent to your email.',
      requiresOTP: true,
      email: user.email,
    });
  } catch (error) {
    // 👇 THIS IS THE MAGIC LINE! It will print the exact reason the email failed to the terminal.
    console.error("🚨 LOGIN CRASH REPORT: ", error); 
    res.status(500).json({ success: false, message: 'Error logging in', error: error.message });
  }
};

exports.verifyLoginOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP are required' });
    }

    const validOTP = await OTP.findOne({ email }).sort({ createdAt: -1 });

    if (!validOTP || validOTP.otp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    await OTP.deleteOne({ _id: validOTP._id });

    const user = await User.findOne({ email });
    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error verifying OTP', error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching profile', error: error.message });
  }
};

exports.logout = (req, res) => {
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};