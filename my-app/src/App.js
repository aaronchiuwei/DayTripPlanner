import React, { useState, useEffect, useMemo } from 'react';
import { Container, Row, Col, Form, Button, Badge, InputGroup, FormControl, Dropdown, DropdownButton } from 'react-bootstrap';
import { GoogleMap, Marker, DirectionsRenderer, LoadScript } from '@react-google-maps/api';
import 'startbootstrap-sb-admin-2/vendor/fontawesome-free/css/all.min.css';
import 'startbootstrap-sb-admin-2/css/sb-admin-2.min.css';

const DayTripPlanner = () => {
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
  const budgets = ["$", "$$", "$$$", "$$$$"];

  const handleSelectFoodType = (eventKey) => setFoodType(eventKey);
  const handleSelectActivity = (eventKey) => setActivity(eventKey);
  const handleSelectBudget = (eventKey) => setBudget(eventKey);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Ideally, move geocodeDestination out of handleSubmit if you plan to use it elsewhere
      // Combine the food type and activity with a space in between for the search term
  const searchTerm = [foodType, activity].filter(Boolean).join(' ');

  // Map the dollar signs to numeric price levels for Yelp
  const priceLevels = { "$": "1", "$$": "2", "$$$": "3", "$$$$": "4" };
  const price = priceLevels[budget];
    const geocodeDestination = async (dest) => {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ 'address': dest }, (results, status) => {
        if (status === 'OK') {
          setMapCenter({
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng()
          });
        } else {
          alert('Geocode was not successful for the following reason: ' + status);
        }
      });
    };

    geocodeDestination(destination);
    try {
      // Construct the search query parameters
      const queryParams = new URLSearchParams({
        term: foodType,
        location: destination,
        price: price, // Use the mapped price level
        // Add other parameters as needed
      });
  
      // Call your backend endpoint with the query params
      console.log(queryParams.toString());
      const response = await fetch(`http://localhost:3001/yelp-search?${queryParams}`);
      const data = await response.json();
      console.log(data.coordinates.latitude);
      setMapCenter({
        lat: data.coordinates.latitude,
        lng: data.coordinates.longitude
      })
      // Now you can do something with the data, e.g., update state to display results
      console.log(data);
    } catch (error) {
      console.error("Failed to fetch Yelp data:", error);
    }
    // Here, you would handle submitting these values to a backend service or using them to filter data client-side
    console.log("Form Submitted", { destination, budget, foodType, activity, interests })
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
    
    //DELETE WHEN YELP ADDED *************
    const locations = useMemo(() => [
    { lat: 32.8812, lng: -117.2344 },
    { lat: 32.8801, lng: -117.2350 },
    { lat: 32.8811, lng: -117.2376 },
    // ... more locations
    ], []);
    
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
        <Col lg={8}>
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
                    <DropdownButton
                      as={InputGroup.Prepend}
                      variant="outline-secondary"
                      title={activity || "Select Activity"}
                      id="input-group-dropdown-3"
                      onSelect={handleSelectActivity}
                    >
                      {activities.map((activity, index) => (
                        <Dropdown.Item key={index} eventKey={activity}>{activity}</Dropdown.Item>
                      ))}
                    </DropdownButton>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Add Interests</Form.Label>
                  <InputGroup>
                    <FormControl
                      type="text"
                      placeholder="Type an interest..."
                      value={inputInterest}
                      onChange={(e) => setInputInterest(e.target.value)}
                    />
                    <Button variant="outline-secondary" onClick={addInterest}>
                      Add Interest
                    </Button>
                  </InputGroup>
                </Form.Group>

                {interests.length > 0 && (
                  <div>
                    <h5>Selected Interests</h5>
                    {interests.map((interest, index) => (
                      <Badge key={index} bg="secondary" className="me-2">
                        {interest}{' '}
                        <span style={{ cursor: 'pointer' }} onClick={() => removeInterest(interest)}>x</span>
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
        <Col lg={8}>
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
    </Container>
  );
};

export default DayTripPlanner;