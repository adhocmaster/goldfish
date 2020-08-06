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
import { connect } from 'react-redux';

import ResponseProcessor from 'framework/ResponseProcessor';
import Utility from 'framework/Utility';
import { Redirect } from 'react-router-dom';

function LoginComponent(props: any) {

    const [isLoggedIn, setLoggedIn] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errors, setErrors] = useState([] as string[]);
    const [email, setemail] = useState("");
    const [password, setPassword] = useState("");

    
    function postLogin(e: any) {

        e.preventDefault();
        console.log(email);
        console.log(password);
        axios.post("http://localhost:4000/users/login", {

                email: email,
                password: password

            }).then(result => {

                console.log(result);

                // if (result.status === 200) {
                //     // setAuthTokens(result.data);
                //     setLoggedIn(true);
                // } else {
                //     setIsError(true);
                // }

                const error = ResponseProcessor.getError(result.data);
                if ( error !== false ) {
                    console.log("got token")
                }

            }).catch(error => {
                
                let errorMessages = ResponseProcessor.getHTTPError(error);
                console.log(errorMessages);
                setErrors(errors => [...errors, ...errorMessages]);
                setIsError(true);
            }
        );
        
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
                            {isError && 
                                <Alert variant="warning">
                                    {Utility.getListRep(errors)}
                                </Alert>
                            }
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs lg="2">
                </Col>
            </Row>
        </Container>
    );
}


const mapStateToProps = function(state: RootState) {

    return {
        count: 0, // full path to state variable
        users: 0 // full path to state variable
    }
}

export default connect(mapStateToProps)(LoginComponent);