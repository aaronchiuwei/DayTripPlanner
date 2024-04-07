const openaiFunction = () => {
const express = require('express');
const axios = require('axios');
const app = express();
const port = 3001;

app.use(express.json()); // For parsing application/json

const OPENAI_API_KEY = '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';

app.post('/generate-itinerary', async (req, res) => {
  const { locations } = req.body; // Assume locations are sent in the request body

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/completions',
      {
        model: "text-davinci-003", // Or another model name
        prompt: `Generate a detailed day itinerary for visiting: ${locations.join(', ')}.`,
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

    // Send the generated text back to the client
    res.json({ itinerary: response.data.choices[0].text });
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    res.status(500).send('Failed to generate itinerary');
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
}
module.exports = { openaiFunction };