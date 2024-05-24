const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000; // Set the port number

// Define routes
app.get('/', (req, res) => {
  res.send('Welcome to Climb backend!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});