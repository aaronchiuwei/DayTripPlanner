import React, { useState, useEffect } from 'react';
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Geocode destination and handle form submission logic here
    console.log("Form Submitted", { destination, budget, foodType, activity, interests });
  };

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

                <Button variant="primary" type="submit" className="mt-3">
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