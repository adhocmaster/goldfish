import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';
import axios from 'axios';
import { RootState } from 'app/store';
import { shallowEqual, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Utility from 'framework/Utility';

import userService from 'features/user/user.service';

export default function SignupComponent(props: any) {

    const [isError, setIsError] = useState(false);
    const [name, setName] = useState("");
    const [email, setemail] = useState("");
    const [password, setPassword] = useState("");

    const errors: string[] = useSelector((state: RootState) => { return state.settingsState.accountErrors} );
    
    
    function submit(e: any) {

        e.preventDefault();
        userService.signup(name, email, password);
        
    }

    if (userService.isLoggedIn()) {

        return (<Redirect to="/account-wizard"></Redirect>);

    } else if (userService.getEmail()) {
        return (<Redirect to="/login"></Redirect>);
    }

    return (
        <Container className="login-container" >
            <Row className="justify-content-md-center">
                <Col xs lg="2">
                </Col>
                <Col md="auto">
                    <Card style={{ width: '18rem' }}>
                        <Card.Body>
                            <Card.Title>Sign up</Card.Title>
                            <Form>
                                <Form.Group controlId="formEmail">
                                    <Form.Control type="text" placeholder="Name"
                                        value={name}
                                        onChange={e => {
                                            setemail(e.target.value);
                                        }} />
                                    <Form.Text className="text-muted">
                                    </Form.Text>
                                </Form.Group>

                                <Form.Group controlId="formBasicEmail">
                                    <Form.Control type="email" placeholder="Enter email"
                                        value={email}
                                        onChange={e => {
                                            setemail(e.target.value);
                                        }} />
                                    <Form.Text className="text-muted">
                                    </Form.Text>
                                </Form.Group>

                                <Form.Group controlId="formBasicPassword">
                                    <Form.Control type="password" placeholder="Password" 
                                        value={password}
                                        onChange={e => {
                                            setPassword(e.target.value);
                                        }} />
                                </Form.Group>
                                <Form.Group controlId="formBasicCheckbox">
                                    <Form.Check type="checkbox" label="Remember me!" />
                                </Form.Group>
                                <Button variant="primary" type="submit" onClick={submit}>
                                    Submit
                                </Button>
                            </Form>
                            <br/>
                            <div>
                                {errors && 
                                    <Alert variant="warning">
                                        {Utility.getListRep(errors)}
                                    </Alert>
                                }
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs lg="2">
                </Col>
            </Row>
        </Container>
    );
}
