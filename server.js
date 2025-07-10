const express = require('express');
const cors = require('cors');  // <-- 👈 Add this line
const nodemailer = require('nodemailer');
const app = express();
const PORT = 3000;

app.use(cors());               // <-- 👈 Add this line
app.use(express.json());

app.post('/send-email', async (req, res) => {
  const { to, subject, text } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'tannumannu818818@gmail.com',     // Replace with your Gmail
      pass: 'cdpt jxwy kypo vzjx'         // App password from Gmail settings
    }
  });

  const mailOptions = {
    from: 'tannumannu818818@gmail.com',
    to,
    subject,
    text
  };

  try {
    await transporter.sendMail(mailOptions);
    res.send('✅ Email sent successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('❌ Email failed to send');
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
