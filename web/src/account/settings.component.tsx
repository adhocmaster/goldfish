import React from 'react';
import ReduxUIComponent from '../framework/ReduxUIComponent';
import { RootState, store } from '../app/store';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

export default class SettingsComponent extends ReduxUIComponent {
    
    
    getStateFromStore(): any {

        return store.getState().settingsState;
        
    }

    render(): any {

        return (
            <Container className="login-container" >
                <Row className="justify-content-md-center">
                    <Col xs lg="2">
                    </Col>
                    <Col md="auto">
                        <Card style={{ width: '18rem' }}>
                            <Card.Body>
                                <Card.Title>Settings</Card.Title>
                                <Form>
                                    <Form.Group controlId="formBasicEmail">
                                        <Form.Control type="email" placeholder="Enter email" />
                                        <Form.Text className="text-muted">
                                        </Form.Text>
                                    </Form.Group>

                                    <Form.Group controlId="formBasicPassword">
                                        <Form.Control type="password" placeholder="Password" />
                                    </Form.Group>
                                    <Form.Group controlId="formBasicCheckbox">
                                        <Form.Check type="checkbox" label="Check me out" />
                                    </Form.Group>
                                    <Button variant="primary" type="submit">
                                        Save
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col xs lg="2">
                    </Col>
                </Row>
            </Container>
        );

    }
}