import React, { useState, useEffect } from 'react';

const TestComponent = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Fetch the data from your API
    fetch('http://localhost:3001/yelp-search?term=burger&location=san+diego')
    .then(response => response.json())
    .then(data => setData(data))
    .catch(error => console.error('Error:', error));
  }, []); // The empty array ensures this effect runs once on mount

  // Render the data or a loading message
  return (
    <div>
      <h1>Test API Data</h1>
      {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : <p>Loading data...</p>}
    </div>
  );
};

export default TestComponent;
