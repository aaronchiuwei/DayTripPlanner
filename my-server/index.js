'use strict';
// require('dotenv').config(); // Uncomment this line if you're using dotenv for API keys
const express = require('express');
const yelp = require('yelp-fusion');
const cors = require('cors');

const app = express();
const port = 3001; // Port where the backend server will listen

// Your Yelp Fusion API Key
const apiKey = '2hrG-_7S2j7so5mhP7rz0Z8hiXSLHcHdK7Ta7xzho7LLkGKnc8qg8wJkol0lDyh0T6efUWnDIcE5mdWP0x2lPfBb9QGmsZ62bAzDFBeNcj1UwJFE07YQu8KsvC0SZnYx';
const client = yelp.client(apiKey);

app.use(cors());

app.get('/yelp-search', (req, res) => {
  const { term = 'coffee', location = 'san francisco, ca', price, categories } = req.query;

  // Construct search parameters object for Yelp API
  const searchParams = {
    term,
    location,
    ...(price && { price }), // Conditionally add price if it's provided
    ...(categories && { categories }), // Conditionally add categories if provided
  };

  client.search(searchParams)
    .then(response => {
      const businesses = response.jsonBody.businesses;
      const sortedBusinesses = businesses.sort((a, b) => b.rating - a.rating);
      const topRatedBusinesses = sortedBusinesses.slice(0, 30);
      
      // Pick a random business from the top 10
      const randomIndex = Math.floor(Math.random() * topRatedBusinesses.length);
      const randomBusiness = topRatedBusinesses[randomIndex];
      
      res.json(randomBusiness);
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch data from Yelp' });
    });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
