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

export default function LoginComponent(props: any) {

    const [isError, setIsError] = useState(false);
    const [errors, setErrors] = useState([] as string[]);
    const [email, setemail] = useState("");
    const [password, setPassword] = useState("");

    const isLoggedIn: boolean = useSelector((state: RootState) => { return state.settingsState.isLoggedIn} );
    
    function postLogin(e: any) {

        e.preventDefault();
        console.log(email);
        console.log(password);
        userService.login(email, password);
        
    }

    if (isLoggedIn) {

        return (<Redirect to="/"></Redirect>);

    }

    return (
        <Container className="login-container" >
            <Row className="justify-content-md-center">
                <Col xs lg="2">
                </Col>
                <Col md="auto">
                    <Card style={{ width: '18rem' }}>
                        <Card.Body>
                            <Card.Title>Login</Card.Title>
                            <Form>
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
                                    <Form.Check type="checkbox" label="Check me out" />
                                </Form.Group>
                                <Button variant="primary" type="submit" onClick={postLogin}>
                                    Submit
                                </Button>
                            </Form>
                            <br/>
                            <div>
                                {isError && 
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
