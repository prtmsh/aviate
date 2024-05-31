const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve extracted.json
app.get('/extracted', (req, res) => {
  fs.readFile('extracted.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading extracted.json:', err);
      res.status(500).send('Error reading extracted.json');
      return;
    }
    res.json(JSON.parse(data));
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
