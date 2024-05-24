const express = require('express');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const passportConfig = require('./passport-config');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000; // Set the port number

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/ascension', { useNewUrlParser: true, useUnifiedTopology: true });

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));

// Define routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/game', // Redirect to the game page on successful login
  failureRedirect: '/', // Redirect back to the main menu on failed login
  failureFlash: true // Enable flash messages for failed login attempts
}));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});