import React, { useState, useEffect } from 'react';

const TestComponent = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Fetch the data from your API
    fetch('/api')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setData(data); // Set the data in state
      })
      .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
      });
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
