const express = require('express');
const { google } = require('googleapis');
const open = require('open');
const cors = require('cors');
const app = express();
app.use(cors());

const CLIENT_ID = 'YOUR_CLIENT_ID';
const CLIENT_SECRET = 'YOUR_CLIENT_SECRET';
const REDIRECT_URI = 'http://localhost:3000/oauth2callback';
const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// Step 1: Redirect user to Google login
app.get('/login', (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/gmail.readonly']
  });
  res.redirect(authUrl);
});

// Step 2: Google redirects back with code
app.get('/oauth2callback', async (req, res) => {
  const code = req.query.code;
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  // Fetch Gmail message
  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
  const response = await gmail.users.messages.list({
    userId: 'me',
    maxResults: 1
  });

  const messageId = response.data.messages[0].id;
  const message = await gmail.users.messages.get({
    userId: 'me',
    id: messageId
  });

  const snippet = message.data.snippet;
  res.send(`<h2>✅ Latest Email Snippet:</h2><p>${snippet}</p>`);
});

app.listen(3000, () => {
  console.log('🚀 Server started at http://localhost:3000');
});
