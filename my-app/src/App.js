
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Badge, InputGroup, FormControl, Dropdown, DropdownButton } from 'react-bootstrap';

const DayTripPlanner = () => {
  const [destination, setDestination] = useState('');
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
      setInterests((prevInterests) => [...prevInterests, inputInterest]);
      setInputInterest('');
    }
  };

  const removeInterest = (interestToRemove) => {
    setInterests(interests.filter(interest => interest !== interestToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here, you would handle submitting these values to a backend service or using them to filter data client-side
    console.log("Form Submitted", { destination, budget, foodType, activity, interests });
  };

  return (
    <Container fluid="md" className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={8}>
          <h2>Day Trip Planner</h2>
          <Form onSubmit={handleSubmit}>
            <InputGroup className="mb-3">
              <FormControl
                placeholder="Enter a destination..."
                aria-label="Destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </InputGroup>

            <DropdownButton
              as={InputGroup.Prepend}
              variant="outline-secondary"
              title={budget || "Budget"}
              id="input-group-dropdown-1"
              className="mb-3"
              onSelect={handleSelectBudget}
            >
              {budgets.map((budget, index) => (
                <Dropdown.Item key={index} eventKey={budget}>{budget}</Dropdown.Item>
              ))}
            </DropdownButton>

            <DropdownButton
              as={InputGroup.Prepend}
              variant="outline-secondary"
              title={foodType || "Select Food Type"}
              id="input-group-dropdown-2"
              className="mb-3"
              onSelect={handleSelectFoodType}
            >
              {foodTypes.map((type, index) => (
                <Dropdown.Item key={index} eventKey={type}>{type}</Dropdown.Item>
              ))}
            </DropdownButton>

            <DropdownButton
              as={InputGroup.Prepend}
              variant="outline-secondary"
              title={activity || "Select Activity"}
              id="input-group-dropdown-3"
              className="mb-3"
              onSelect={handleSelectActivity}
            >
              {activities.map((activity, index) => (
                <Dropdown.Item key={index} eventKey={activity}>{activity}</Dropdown.Item>
              ))}
            </DropdownButton>

            <Form.Group className="mb-3">
              <Form.Label>Add Interests</Form.Label>
              <Form.Control
                type="text"
                placeholder="Type an interest..."
                value={inputInterest}
                onChange={(e) => setInputInterest(e.target.value)}
              />
              <Button variant="outline-secondary" className="mt-2" onClick={addInterest}>
                Add Interest
              </Button>
            </Form.Group>

            {interests.length > 0 && (
              <div>
                <h5>Selected Interests</h5>
                {interests.map((interest, index) => (
                  <Badge bg="secondary" key={index} className="me-2" pill>
                    {interest}
                    <span style={{ cursor: 'pointer', marginLeft: '5px' }} onClick={() => removeInterest(interest)}>x</span>
                  </Badge>
                ))}
              </div>
            )}

            <Button variant="primary" type="submit" className="mt-3">
              Plan My Trip
            </Button>
          </Form>

          <div className="mt-5" style={{ height: '400px', backgroundColor: '#f0f0f0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            Map Placeholder
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default DayTripPlanner;

