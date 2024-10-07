import express from 'express';
import nodemailer from 'nodemailer';
import bodyParser from 'body-parser';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Initialize express app
const app = express();

// Load environment variables from .env file
dotenv.config();

// Define port from environment variables or use default
const port = process.env.MAIL_SERVER_PORT || 5001;

// Middleware setup
app.use(bodyParser.json());
app.use(cors());

// Resolve current directory
const __dirname = path.resolve();

// Configure multer storage for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Initialize multer with the defined storage
const upload = multer({ storage });

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_SERVER_HOST,
  port: process.env.MAIL_SERVER_PORT,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  tls: {
    ciphers: 'SSLv3',
  },
});

console.log('Transporter created:', transporter);

// Endpoint for job application submissions
app.post('/apply', upload.single('file'), (req, res) => {
  const { firstName, lastName, phoneNumber, email, college, role, experienceYears } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).send('No file uploaded.');
  }

  const mailOptions = {
    from: process.env.Emailfrom,
    to: process.env.Emailto,
    subject: 'Job Application Submission',
    text: `
      First Name: ${firstName}
      Last Name: ${lastName}
      Phone Number: ${phoneNumber}
      Email: ${email}
      College: ${college}
      Role: ${role}
      Experience Years: ${experienceYears}
    `,
    attachments: [
      {
        filename: file.originalname,
        path: file.path,
      },
    ],
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending application email:', error);
      return res.status(500).send('Error sending email: ' + error.message);
    }
    console.log('Email sent: ' + info.response);
    res.status(200).send('Job Application submitted successfully');
  });
});

// Endpoint for internship application submissions
app.post('/applyInternship', upload.single('file'), (req, res) => {
  const { firstName, lastName, phoneNumber, email, college, currentSem, internshipMonth, role, internshipLocation } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).send('No file uploaded.');
  }

  const mailOptions = {
    from: process.env.Emailfrom,
    to: process.env.Emailto,
    subject: 'Internship Application Submission',
    text: `
      First Name: ${firstName}
      Last Name: ${lastName}
      Phone Number: ${phoneNumber}
      Email: ${email}
      College: ${college}
      Current Sem: ${currentSem}
      Internship Month: ${internshipMonth}
      Role: ${role}
      Internship Location: ${internshipLocation}
    `,
    attachments: [
      {
        filename: file.originalname,
        path: file.path,
      },
    ],
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending application email:', error);
      return res.status(500).send('Error sending email: ' + error.message);
    }
    console.log('Email sent: ' + info.response);
    res.status(200).send('Internship Application submitted successfully');
  });
});

// Endpoint for sending welcome email upon signing up
app.post('/SigninWelcomeEmail', (req, res) => {
  const { email, firstName } = req.body;

  const mailOptions = {
    from: process.env.Emailfrom,
    to: email,
    subject: 'Welcome to Aarna Law | SignUp',
    html: `
      <p>Welcome ${firstName} to Aarna Law!</p>
      <p>We’re excited to have you join our community.</p>
      <p>
        Regards,<br/>
        Aarna Law Team<br/>
      
        <br/>
        Bengaluru | New Delhi | Mumbai<br/>
        Website: <a href="https://www.aarnalaw.com">www.aarnalaw.com</a>
      </p>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending welcome email:', error);
      return res.status(500).send('Error sending welcome email: ' + error.message);
    }
    console.log('Welcome email sent: ' + info.response);
    res.status(200).send('Welcome email sent successfully');
  });
});

// Endpoint for sending subscription email
app.post('/sendSubscribeEmail', (req, res) => {
  const { email, topics } = req.body;

  const mailOptions = {
    from: process.env.Emailfrom,
    to: process.env.Emailto,
    subject: 'Subscription Confirmation',
    html: `
      <p>Thank you for subscribing to our newsletter!</p>
      <p>You have subscribed to the following categories:</p>
      <ul>
        ${topics.bankruptcy ? '<li>Bankruptcy Restructuring & Insolvency</li>' : ''}
        ${topics.intellectualProperty ? '<li>Intellectual Property</li>' : ''}
        ${topics.internationalDispute ? '<li>International Dispute</li>' : ''}
        ${topics.others ? '<li>Others</li>' : ''}
      </ul>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending subscription email:', error);
      return res.status(500).send('Error sending subscription email: ' + error.message);
    }
    console.log('Subscription email sent: ' + info.response);
    res.status(200).send('Subscription email sent successfully');
  });
});

// Endpoint for sending welcome email
app.post('/sendWelcomeEmail', (req, res) => {
  const { email, topics } = req.body;

  const mailOptions = {
    from: process.env.Emailfrom,
    to: email,
    subject: 'Welcome to Aarna Law | SUBSCRIBE TO NEWSLETTER',
    html: `
      <p>Welcome to Aarna Law!</p>
      <p>You have subscribed to the following categories of news:</p>
      <ul>
        ${topics.bankruptcy ? '<li>Bankruptcy Restructuring & Insolvency</li>' : ''}
        ${topics.intellectualProperty ? '<li>Intellectual Property</li>' : ''}
        ${topics.internationalDispute ? '<li>International Dispute</li>' : ''}
        ${topics.others ? '<li>Others</li>' : ''}
      </ul>
      <p>
        Regards,<br/>
        Aarna Law Team<br/>
       
        <br/>
        Bengaluru | New Delhi | Mumbai<br/>
        Website: <a href="https://www.aarnalaw.com">www.aarnalaw.com</a>
      </p>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending welcome email:', error);
      return res.status(500).send('Error sending welcome email: ' + error.message);
    }
    console.log('Welcome email sent: ' + info.response);
    res.status(200).send('Welcome email sent successfully');
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on : ${process.env.MAIL_SERVER_HOST}:${port}`);
});
