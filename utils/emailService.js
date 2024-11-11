// utils/emailService.js
import nodemailer from 'nodemailer';

let transporter;

const createTransporter = () => {
  try {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: true, // use SSL
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Verify the connection configuration
    transporter.verify(function(error, success) {
      if (error) {
        console.log('SMTP connection error:', error);
      } else {
        console.log('Server is ready to take our messages');
      }
    });

  } catch (error) {
    console.error('Error creating email transporter:', error);
  }
};

createTransporter();

export const sendOTP = async (email, otp) => {
  if (!transporter) {
    console.error('Email transporter not initialized');
    throw new Error('Email service is not available');
  }

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Your OTP for Admin Account',
    text: `Your OTP is: ${otp}. This OTP is valid for 10 minutes.`
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};