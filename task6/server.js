const express = require('express');
const cors = require('cors');
const twilio = require('twilio');

const app = express();
app.use(cors());
app.use(express.json());

const accountSid = 'YOUR_TWILIO_SID';           // 🔁 Replace
const authToken = 'YOUR_TWILIO_AUTH_TOKEN';     // 🔁 Replace
const twilioNumber = 'YOUR_TWILIO_PHONE';       // 🔁 Replace (like +1415xxxxxx)

const client = twilio(accountSid, authToken);

app.post('/send-sms', (req, res) => {
  const { to, message } = req.body;

  client.messages
    .create({
      from: twilioNumber,
      to,
      body: message,
    })
    .then(() => res.send('✅ SMS Sent Successfully'))
    .catch(err => {
      console.error(err);
      res.status(500).send('❌ Failed to send SMS');
    });
});

app.listen(3000, () => console.log('🚀 Server started on http://localhost:3000'));
