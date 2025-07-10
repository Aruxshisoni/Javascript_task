const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.static('uploads'));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, 'photo_' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

app.post('/send-photo', upload.single('photo'), async (req, res) => {
  const { to, subject, text } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your_email@gmail.com',         // 🔁 Replace
      pass: 'your_app_password'             // 🔁 Replace
    }
  });

  const mailOptions = {
    from: 'your_email@gmail.com',
    to,
    subject,
    text,
    attachments: [{
      filename: req.file.filename,
      path: req.file.path
    }]
  };

  try {
    await transporter.sendMail(mailOptions);
    res.send('✅ Photo sent successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('❌ Failed to send photo');
  }
});

app.listen(3000, () => console.log('🚀 Server started on http://localhost:3000'));
