const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
const port = 3001;

app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
  service: 'Office365',
  auth: {
    user: 'murarijha@aarnalaw.com',
    pass: 'Iinfosts@23434',
  },
});

app.post('/sendEmail', (req, res) => {
  const { name, email, phone, message } = req.body;

  const mailOptions = {
    from: 'murarijha@aarnalaw.com',
    to: 'recipient@example.com',
    subject: 'New Contact Form Submission',
    text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      res.status(500).send('Error sending email');
    } else {
      console.log('Email sent: ' + info.response);
      res.status(200).send('Email sent successfully');
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
