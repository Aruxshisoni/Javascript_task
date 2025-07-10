const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.static('uploads'));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, 'video_' + Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });

app.post('/send-video', upload.single('video'), async (req, res) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your_email@gmail.com',         // 🔁 Replace
      pass: 'your_app_password'             // 🔁 Replace
    }
  });

  const mailOptions = {
    from: 'your_email@gmail.com',
    to: 'receiver@gmail.com',              // 🔁 Replace with destination
    subject: '🎥 Recorded Video',
    text: 'Here is the recorded video from browser',
    attachments: [{
      filename: req.file.filename,
      path: req.file.path
    }]
  };

  try {
    await transporter.sendMail(mailOptions);
    res.send('✅ Video sent via email');
  } catch (err) {
    console.error(err);
    res.status(500).send('❌ Failed to send video');
  }
});

app.listen(3000, () => console.log('🚀 Server running on http://localhost:3000'));
