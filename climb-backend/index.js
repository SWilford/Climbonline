const express = require('express');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const passportConfig = require('./passport-config');
const path = require('path');
const User = require('./models/user');

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
  failureRedirect: '/login', // Redirect back to the main menu on failed login
  failureFlash: true // Enable flash messages for failed login attempts
}));

app.get('/login', (req, res) => {
  res.sendFile(__dirname+'/public/login.html');
})

app.get('/logout', (req, res) => {
  req.logOut();
  res.redirect('/')
})


app.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.redirect('/login'); // Redirect back to login if user already exists
    } else {
      const newUser = new User({ email, password });
      await newUser.save();
      res.redirect('/login'); // Redirect to login page after successful registration
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});