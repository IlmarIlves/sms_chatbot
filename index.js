const express = require('express');
const bodyParser = require('body-parser');
const MessagingResponse = require('twilio').twiml.MessagingResponse;

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));

app.post('/sms', (req, res) => {
  const twiml = new MessagingResponse();

  // Get user's message
  const userMessage = req.body.Body.toLowerCase();

  // Initialize user session if not exists
  let userSession = {};
  if (!req.session.userSession) {
    req.session.userSession = {};
  }
  userSession = req.session.userSession;

  // Chatbot logic based on user's message
  if (!userSession.name) {
    // If user has not provided name yet
    userSession.name = userMessage;
    twiml.message(`Hi ${userSession.name}! Please provide your address.`);
  } else if (!userSession.address) {
    // If user has provided name but not address
    userSession.address = userMessage;
    twiml.message(`Thanks, ${userSession.name}! Which internet package are you interested in?`);
  } else if (!userSession.package) {
    // If user has provided name and address but not the desired package
    userSession.package = userMessage;
    twiml.message(`Great, ${userSession.name}! We will process your request for ${userSession.package} at ${userSession.address}.`);
    // Reset user session for the next interaction
    req.session.userSession = {};
  }

  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twiml.toString());
});

app.listen(port, () => {
  console.log(`Chatbot listening at http://localhost:${port}`);
});
