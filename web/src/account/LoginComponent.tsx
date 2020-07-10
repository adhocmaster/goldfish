import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import axios from 'axios';
import { RootState } from 'app/store';
import { connect } from 'react-redux';

function LoginComponent(props: any) {

    const [isLoggedIn, setLoggedIn] = useState(false);
    const [isError, setIsError] = useState(false);
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    // const { setAuthTokens } = useAuth();

    
    function postLogin(e: any) {

        e.preventDefault();
        console.log(userName);
        console.log(password);
        // axios.post("https://www.somePlace.com/auth/login", {
        // userName,
        // password
        // }).then(result => {
        // if (result.status === 200) {
        //     // setAuthTokens(result.data);
        //     setLoggedIn(true);
        // } else {
        //     setIsError(true);
        // }
        // }).catch(e => {
        // setIsError(true);
        // });
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
                                    
                                        value={userName}
                                        onChange={e => {
                                            setUserName(e.target.value);
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