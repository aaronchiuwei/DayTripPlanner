'use strict';
// require('dotenv').config(); // Uncomment this line if you're using dotenv for API keys
const express = require('express');
const yelp = require('yelp-fusion');
const axios = require('axios');
const cors = require('cors');
const{OpenAIAPI} = require('openai');

const app = express();
app.use(express.json());
const port = 3001; // Port where the backend server will listen

// Your Yelp Fusion API Key
const apiKey = '2hrG-_7S2j7so5mhP7rz0Z8hiXSLHcHdK7Ta7xzho7LLkGKnc8qg8wJkol0lDyh0T6efUWnDIcE5mdWP0x2lPfBb9QGmsZ62bAzDFBeNcj1UwJFE07YQu8KsvC0SZnYx';
const OPENAI_API_KEY = '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';
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
app.post('/generate-itinerary', async (req, res) => {
  const { locations } = req.body; // Make sure locations is being sent in the request's body
  const endpoint = 'https://api.openai.com/v1/completions'; // Use the completions endpoint

  try {
    const response = await axios.post(
      endpoint,
      {
        model: "gpt-3.5-turbo-instruct", // You can choose other models like text-curie-001 based on your need
        prompt: `Generate a detailed day itinerary for visiting: ${locations}.`,
        temperature: 0.7,
        max_tokens: 1000,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        }
      }
    );

    res.json({ itinerary: response.data.choices[0].text });
  } catch (error) {
    console.error('Error calling OpenAI API:', error.message);
    if (error.response) {
      // The server responded with a status code outside the range of 2xx
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    res.status(500).send('Failed to generate itinerary');
  }
});
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
