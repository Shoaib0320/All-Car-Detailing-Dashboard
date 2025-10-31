import nodemailer from 'nodemailer';

// Nodemailer install karo
// npm install nodemailer

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const mailOptions = {
      from: `"Agent System" <${process.env.SMTP_FROM_EMAIL}>`,
      to,
      subject,
      html,
      text,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Email sending failed');
  }
};

// Email Templates
export const emailTemplates = {
  agentWelcome: (agentName, agentId, password) => ({
    subject: 'Welcome to Agent System - Your Account Details',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #0070f3; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
          .credentials { background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #0070f3; margin: 15px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Agent Management System</h1>
          </div>
          <div class="content">
            <h2>Welcome, ${agentName}!</h2>
            <p>Your agent account has been successfully created. Here are your login details:</p>
            
            <div class="credentials">
              <h3>Login Credentials:</h3>
              <p><strong>Agent ID:</strong> ${agentId}</p>
              <p><strong>Password:</strong> ${password}</p>
              <p><strong>Login URL:</strong> ${process.env.FRONTEND_URL}/login</p>
            </div>

            <p><strong>Important Security Notes:</strong></p>
            <ul>
              <li>Keep your credentials secure and do not share with anyone</li>
              <li>Change your password after first login</li>
              <li>Use the Agent ID (not email) to login</li>
            </ul>

            <p>If you have any questions, please contact the system administrator.</p>
          </div>
          <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Welcome to Agent System!
      
      Your agent account has been created successfully.
      
      Login Details:
      Agent ID: ${agentId}
      Password: ${password}
      Login URL: ${process.env.FRONTEND_URL}/login
      
      Important:
      - Keep your credentials secure
      - Change password after first login
      - Use Agent ID to login
      
      This is an automated message.
    `
  }),

  passwordReset: (resetLink) => ({
    subject: 'Password Reset Request - Agent System',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #dc3545; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
          .button { background: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 15px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <h2>Reset Your Password</h2>
            <p>You requested to reset your password. Click the button below to create a new password:</p>
            
            <a href="${resetLink}" class="button">Reset Password</a>
            
            <p>If the button doesn't work, copy and paste this link in your browser:</p>
            <p>${resetLink}</p>
            
            <p><strong>This link will expire in 1 hour.</strong></p>
            <p>If you didn't request this reset, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Password Reset Request
      
      You requested to reset your password. Use the link below:
      
      ${resetLink}
      
      This link expires in 1 hour.
      
      If you didn't request this, please ignore this email.
    `
  })
};