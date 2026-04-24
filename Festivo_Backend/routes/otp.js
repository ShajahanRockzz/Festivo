const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Configure nodemailer with Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'shajahan2rockzz@gmail.com',
    pass: 'moda djpo rrds lcje' // Gmail App Password
  }
});

// Store OTPs in memory (in production, use database)
const otpStore = {};

// Generate random 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP email
async function sendOTPEmail(email, otp) {
  const mailOptions = {
    from: 'shajahan2rockzz@gmail.com',
    to: email,
    subject: 'Festivo Event Management - Email Verification OTP',
    html: `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; background: linear-gradient(135deg, #0052a3, #2979f0); padding: 30px; border-radius: 15px 15px 0 0; color: white;">
          <h1 style="margin: 0; font-size: 28px; font-weight: 700;">Festivo</h1>
          <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">Event Management Platform</p>
        </div>
        <div style="border: 1px solid #e2e8f0; border-top: none; padding: 30px; border-radius: 0 0 15px 15px;">
          <h2 style="color: #1a2332; font-size: 20px; margin: 0 0 20px 0;">Email Verification Required</h2>
          <p style="color: #4a5568; font-size: 14px; line-height: 1.6; margin: 0 0 25px 0;">
            Thank you for registering with Festivo! To complete your registration, please verify your email address by entering the OTP below.
          </p>
          <div style="background: #e3f2fd; border: 2px solid #2979f0; border-radius: 10px; padding: 20px; text-align: center; margin-bottom: 25px;">
            <p style="color: #718096; font-size: 12px; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 1px;">Your OTP Code</p>
            <div style="font-size: 36px; font-weight: 700; color: #0052a3; letter-spacing: 8px; font-family: 'Courier New', monospace; margin: 0;">
              ${otp}
            </div>
          </div>
          <p style="color: #718096; font-size: 12px; margin: 0 0 20px 0;">
            <strong>Important:</strong> This OTP will expire in 10 minutes. Do not share this code with anyone.
          </p>
          <div style="background: #fff9e3; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 5px; margin-bottom: 25px;">
            <p style="color: #92400e; font-size: 13px; margin: 0;">
              <strong>Security Tip:</strong> Festivo staff will never ask for your OTP. If you didn't request this, please ignore this email.
            </p>
          </div>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 25px 0;">
          <p style="color: #718096; font-size: 12px; margin: 0; text-align: center;">
            © 2024 Festivo Event Management. All rights reserved.
          </p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
}

// POST /api/otp/send-otp
router.post('/send-otp', async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Check if OTP was recently sent (prevent spam)
    if (otpStore[email] && otpStore[email].timestamp) {
      const timePassed = (Date.now() - otpStore[email].timestamp) / 1000;
      if (timePassed < 30) {
        return res.status(429).json({
          success: false,
          message: 'Please wait 30 seconds before requesting a new OTP'
        });
      }
    }

    // Generate new OTP
    const otp = generateOTP();

    // Send email
    const emailSent = await sendOTPEmail(email, otp);

    if (!emailSent) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP. Please try again.'
      });
    }

    // Store OTP with timestamp (expires in 10 minutes)
    otpStore[email] = {
      code: otp,
      timestamp: Date.now(),
      expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
    };

    res.json({
      success: true,
      message: `OTP sent successfully to ${email}`
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred. Please try again.'
    });
  }
});

// POST /api/otp/verify-otp
router.post('/verify-otp', (req, res) => {
  try {
    const { email, otp } = req.body;

    // Validate inputs
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required'
      });
    }

    // Check if OTP exists
    if (!otpStore[email]) {
      return res.status(400).json({
        success: false,
        message: 'No OTP found for this email. Please request a new one.'
      });
    }

    const storedOTP = otpStore[email];

    // Check if OTP expired
    if (Date.now() > storedOTP.expiresAt) {
      delete otpStore[email];
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.'
      });
    }

    // Verify OTP
    if (storedOTP.code !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP. Please try again.'
      });
    }

    // OTP verified successfully - delete it
    delete otpStore[email];

    res.json({
      success: true,
      message: 'Email verified successfully'
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred. Please try again.'
    });
  }
});

module.exports = router;
