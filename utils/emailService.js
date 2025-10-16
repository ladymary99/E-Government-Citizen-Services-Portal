const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// Send email
const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@egovernment.gov',
      to,
      subject,
      text,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: error.message };
  }
};

// Email templates
const emailTemplates = {
  requestSubmitted: (userName, requestNumber) => ({
    subject: 'Service Request Submitted Successfully',
    text: Dear ${userName},\n\nYour service request #${requestNumber} has been submitted successfully.\n\nWe will review your request and notify you of any updates.\n\nThank you,\nE-Government Portal,
    html: `
      <h2>Service Request Submitted</h2>
      <p>Dear ${userName},</p>
      <p>Your service request <strong>#${requestNumber}</strong> has been submitted successfully.</p>
      <p>We will review your request and notify you of any updates.</p>
      <br>
      <p>Thank you,<br>E-Government Portal</p>
    `
  }),

  requestStatusUpdated: (userName, requestNumber, status, comments) => ({
    subject: Service Request ${requestNumber} - Status Updated,
    text: Dear ${userName},\n\nYour service request #${requestNumber} status has been updated to: ${status.toUpperCase()}\n\n${comments ? 'Comments: ' + comments : ''}\n\nThank you,\nE-Government Portal,
    html: `
      <h2>Request Status Update</h2>
      <p>Dear ${userName},</p>
      <p>Your service request <strong>#${requestNumber}</strong> status has been updated to: <strong>${status.toUpperCase()}</strong></p>
      ${comments ? <p><strong>Comments:</strong> ${comments}</p> : ''}
      <br>
      <p>Thank you,<br>E-Government Portal</p>
    `
  }),

  paymentConfirmation: (userName, requestNumber, amount, transactionId) => ({
    subject: 'Payment Confirmation',
    text: Dear ${userName},\n\nYour payment of $${amount} for request #${requestNumber} has been confirmed.\n\nTransaction ID: ${transactionId}\n\nThank you,\nE-Government Portal,
    html: `
      <h2>Payment Confirmation</h2>
      <p>Dear ${userName},</p>
      <p>Your payment of <strong>$${amount}</strong> for request <strong>#${requestNumber}</strong> has been confirmed.</p>
      <p>Transaction ID: ${transactionId}</p>
      <br>
      <p>Thank you,<br>E-Government Portal</p>
    `
  })
};

module.exports = {
  sendEmail,
  emailTemplates
};