import React, { useState, useEffect, useMemo } from 'react';
import { Container, Row, Col, Form, Button, Badge, InputGroup, FormControl, Dropdown, DropdownButton } from 'react-bootstrap';
import { GoogleMap, Marker, DirectionsRenderer, LoadScript } from '@react-google-maps/api';
import 'startbootstrap-sb-admin-2/vendor/fontawesome-free/css/all.min.css';
import 'startbootstrap-sb-admin-2/css/sb-admin-2.min.css';

const DayTripPlanner = () => {
  document.body.style.backgroundColor = "#E6E3DB";
  const indexToLetter = (index) => {
    return String.fromCharCode(65 + index); // 65 is the ASCII code for 'A'
  };
  const [locations, setLocations] = useState([]);
  const [destination, setDestination] = useState('');
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [isMapsLoaded, setIsMapsLoaded] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 32.8812, lng: -117.2344 });
  const [budget, setBudget] = useState('');
  const [foodType, setFoodType] = useState('');
  const [activity, setActivity] = useState('');
  const [interests, setInterests] = useState([]);
  const [inputInterest, setInputInterest] = useState('');

  const foodTypes = ["Local Cuisine", "Vegetarian", "Vegan", "Seafood", "Street Food"];
  const activities = ["Hiking", "Shopping", "Historical Sites", "Beach", "Nightlife"];
  const mealTypes = ["breakfast", "lunch", "dinner"];
  const budgets = ["$", "$$", "$$$", "$$$$"];
  const categoryMappings = {
    "Hiking": "hiking",
    "Shopping": "shopping",
    "Historical Sites": "landmarks",
    "Beach": "beaches",
    "Nightlife": "nightlife",
  };
  const toggleInterest = (selectedActivity) => {
    setInterests(currentInterests => {
      if (currentInterests.includes(selectedActivity)) {
        return currentInterests.filter(interest => interest !== selectedActivity);
      } else {
        return [...currentInterests, selectedActivity];
      }
    });
  };

  // Check if an activity is in the interests array
  const isInterestSelected = (activity) => {
    return interests.includes(activity);
  };

  const handleSelectFoodType = (eventKey) => setFoodType(eventKey);
  const handleSelectActivity = (eventKey) => setActivity(eventKey);
  const handleSelectBudget = (eventKey) => setBudget(eventKey);

  const addLocation = (newLocation) => {
    setLocations(currentLocations => [...currentLocations, newLocation]);
  };

  const addInterest = (e) => {
    e.preventDefault();
    if (inputInterest && !interests.includes(inputInterest)) {
      setInterests(prevInterests => [...prevInterests, inputInterest]);
      setInputInterest('');
    }
  };

  const removeInterest = (interestToRemove) => {
    setInterests(interests.filter(interest => interest !== interestToRemove));
  };

  const fetchActivities = async () => {
    for (const interest of interests) {
      // Use the activity as the search term directly
      const searchTerm = activity;
      
      try {
        const queryParams = new URLSearchParams({
          term: searchTerm, // Directly use the activity as the search term
          location: destination,
          categories: categoryMappings[interest], // Optionally, map activities to specific Yelp categories
        });
  
        const response = await fetch(`http://localhost:3001/yelp-search?${queryParams}`);
        const data = await response.json();
        

        console.log(data);
  
        if (data.coordinates) {
          const newLocation = { name: data.name, lat: data.coordinates.latitude, lng: data.coordinates.longitude };
          addLocation(newLocation); // Assuming this function adds the location to an array or state for rendering
        }
      } catch (error) {
        console.error(`Failed to fetch Yelp data for ${activity}:`, error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Ideally, move geocodeDestination out of handleSubmit if you plan to use it elsewhere
      // Combine the food type and activity with a space in between for the search term
  const searchTerm = [foodType, activity].filter(Boolean).join(' ');

  // Map the dollar signs to numeric price levels for Yelp
  const priceLevels = { "$": "1", "$$": "2", "$$$": "3", "$$$$": "4" };
  const mealTypes = ["breakfast", "lunch", "dinner"];
  const price = priceLevels[budget];
  for (const meal of mealTypes) {
    // Combine meal type with the food type and activity for the search term
    const searchTerm = [meal, foodType].filter(Boolean).join(' ');
    try {
      // Construct the search query parameters
      const queryParams = new URLSearchParams({
        term: searchTerm, // Now includes the meal type
        location: destination,
        price: priceLevels[budget], // Use the mapped price level
        // Add other parameters as needed
      });

      console.log(queryParams.toString());
      const response = await fetch(`http://localhost:3001/yelp-search?${queryParams}`);
      const data = await response.json();

      // Assuming each response includes a relevant location
      if (data.coordinates) {
        const newLocation = { name: data.name, lat: data.coordinates.latitude, lng: data.coordinates.longitude };
        //setMapCenter(newLocation); // Update map center to the latest location
        addLocation(newLocation); // Add the new location for rendering on the map
      }
      console.log(data);
    } catch (error) {
      console.error(`Failed to fetch Yelp data for ${meal}:`, error);
    }
  }
  fetchActivities();
  console.log("Form Submitted", { destination, budget, foodType, activity, interests });
};
  const mapContainerStyle = {
    height: '400px',
    width: '100%'
    };
    const center = {
    lat: -25.344, // Default center, update as needed
    lng: 131.031
    };
    const googleMapsApiKey = 'AIzaSyDW16hk55KXeV3SIFMETLNZkkAxNL8LAQE';
    
    useEffect(() => {
    const drawRoute = async () => {
    if (!isMapsLoaded || locations.length < 2) return;
    
    const directionsService = new window.google.maps.DirectionsService();
    const origin = locations[0];
    const destination = locations[locations.length - 1];
    const waypoints = locations.slice(1, -1).map(location => ({ location, stopover: true }));
    
    try {
    const response = await directionsService.route({
    origin,
    destination,
    waypoints,
    travelMode: window.google.maps.TravelMode.DRIVING,
    });
    setDirectionsResponse(response);
    } catch (error) {
    console.error('Directions request failed due to ' + error);
    }
    };
    
    if (isMapsLoaded) {
    drawRoute();
    }
    }, [isMapsLoaded, locations]);

  const handleScriptLoad = () => {
    setIsMapsLoaded(true);
  };

  return (
    <Container fluid className="mt-5">
      <Row className="justify-content-center">
        <Col lg={10}>
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h2 className="m-0 font-weight-bold text-primary">Day Trip Planner</h2>
            </div>
            <div className="card-body">
              <Form onSubmit={handleSubmit}>
                <InputGroup className="mb-3">
                  <FormControl
                    placeholder="Enter a destination..."
                    aria-label="Destination"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                  />
                </InputGroup>

                <Row className="mb-3 justify-content-between">
                  <Col md={4}>
                    <DropdownButton
                      as={InputGroup.Prepend}
                      variant="outline-secondary"
                      title={budget || "Budget"}
                      id="input-group-dropdown-1"
                      onSelect={handleSelectBudget}
                    >
                      {budgets.map((budget, index) => (
                        <Dropdown.Item key={index} eventKey={budget}>{budget}</Dropdown.Item>
                      ))}
                    </DropdownButton>
                  </Col>
                  <Col md={4}>
                    <DropdownButton
                      as={InputGroup.Prepend}
                      variant="outline-secondary"
                      title={foodType || "Select Food Type"}
                      id="input-group-dropdown-2"
                      onSelect={handleSelectFoodType}
                    >
                      {foodTypes.map((type, index) => (
                        <Dropdown.Item key={index} eventKey={type}>{type}</Dropdown.Item>
                      ))}
                    </DropdownButton>
                  </Col>
                  <Col md={4}>
          <Form>
            {/* Multi-select dropdown for activities */}
            <Dropdown>
              <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic" style={{backgroundColor: 'white', color: 'gray'}}>
                Select Activities
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {activities.map((activity, index) => (
                  <Dropdown.Item 
                    key={index} 
                    onClick={() => toggleInterest(activity)}
                    active={isInterestSelected(activity)}>
                    {isInterestSelected(activity) ? '✓ ' : ''}{activity}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>

            {/* Display selected interests */}


            {/* The rest of your form elements */}
          </Form>
        </Col>
                </Row>

  

                {interests.length > 0 && (
                  <div>
                  <h5>Selected Interests</h5>
                  {interests.map((interest, index) => (
                    <Badge key={index} style={{ backgroundColor: 'blue', color: 'white' }} className="me-2">
                      {interest}{' '}
                      <span style={{ cursor: 'pointer', color: 'white' }} onClick={() => removeInterest(interest)}>x</span>
                    </Badge>
                  ))}
                </div>
                )}

                <Button variant="primary" type="submit" className="mt-3 " onClick={handleSubmit}>
                  Plan My Trip
                </Button>
              </Form>
            </div>
          </div>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col lg={10}>
          <div className="card shadow mb-4">
            <div className="card-body">
              <LoadScript googleMapsApiKey="AIzaSyDW16hk55KXeV3SIFMETLNZkkAxNL8LAQE" onLoad={handleScriptLoad}>
                <GoogleMap
                  id="map"
                  mapContainerStyle={{ height: '400px', width: '100%' }}
                  zoom={12}
                  center={mapCenter}
                >
                  <Marker position={mapCenter} />
                  {directionsResponse && <DirectionsRenderer directions={directionsResponse} />}
                </GoogleMap>
              </LoadScript>
            </div>
          </div>
        </Col>
      </Row>
      <Row className="justify-content-center mt-4">
        <Col lg={10}>
          <div className="card shadow">
            <div className="card-header py-3">
              <h2 className="m-0 font-weight-bold text-primary">Planned Locations</h2>
            </div>
            <div className="card-body">
              <ul>
                {locations.map((location, index) => (
                  <li key={index}>{location.name} - {indexToLetter(index)}</li>
                ))}
              </ul>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default DayTripPlanner;