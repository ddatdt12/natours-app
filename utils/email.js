const nodemailer = require('nodemailer');

const sendEmail = async options => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    service: 'SendinBlue',
    auth: {
      user: process.env.SENDINBLUE_USERNAME,
      pass: process.env.SENDINBLUE_PASSWORD
    }
  });

  // 2) Define the email options
  const mailOptions = {
    from: 'Dat Dt <ddatdt12@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message
    // html: `<div>${options.message}</div>`
  };

  // 3) Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
