'use strict';
require('dotenv').config();
const express = require('express');
const yelp = require('yelp-fusion');
const cors = require('cors');

const app = express();
const port = 3001; // Port where the backend server will listen

// Your Yelp Fusion API Key
const apiKey = process.env.YELP_API_KEY;
const client = yelp.client(apiKey);

// Use CORS for cross-origin allowance
app.use(cors());

// Yelp search route
app.get('/yelp-search', (req, res) => {
  // Extract query params
  const { term = 'Four Barrel Coffee', location = 'san francisco, ca' } = req.query;

  client.search({ term, location })
    .then(response => {
      const firstResult = response.jsonBody.businesses[0];
      res.json(firstResult); // Send the first result back to the client
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch data from Yelp' });
    });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});