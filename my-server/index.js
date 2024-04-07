'use strict';
//require('dotenv').config();
const express = require('express');
const yelp = require('yelp-fusion');
const cors = require('cors');

const app = express();
const port = 3001; // Port where the backend server will listen

// Your Yelp Fusion API Key
const apiKey = '1Om3QOfLFzesvUcSRKQVqXOfd1DDz0uhf03eRqyeiGYNrOHOR3IdZXUOIhL4MD1tcoRgBMw7nwtJ9uHoayqUabV5TzjGAMPFGER4wSJ__SGIu1kkNQMX_2axUbERZnYx';
const client = yelp.client(apiKey);

// Use CORS for cross-origin allowance
app.use(cors());

app.get('/yelp-search', (req, res) => {
  // Extract query params with defaults if not provided
  const { term = 'Four Barrel Coffee', location = 'san francisco, ca', price} = req.query;

  // Construct search parameters object for Yelp API
  const searchParams = {
    term,
    location
  };

  // Add optional parameters only if they are provided
  if (price) searchParams.price = price; // price should be a string like "1", "2", "3", or "4"
  // Call Yelp search with the constructed search parameters
  client.search(searchParams)
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