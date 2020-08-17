import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import logo from './../logo.svg';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import userService from 'features/user/user.service';

function NavComponent() {
    const isLoggedIn = userService.isLoggedIn();
    const email = userService.getEmail();
    console.log("Entered NavComponent");

    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Navbar.Brand href="#home">
                <img
                    alt=""
                    src={logo}
                    width="30"
                    height="30"
                    className="d-inline-block align-top"
                />{' '}
                {process.env.REACT_APP_NAME}
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link href="/">Dashboard</Nav.Link>
                    <Nav.Link href="#week">Week details</Nav.Link>
                </Nav>
                {
                    isLoggedIn 
                    &&
                    <Nav>
                        <NavDropdown title={email} id="collasible-nav-dropdown" alignRight>
                            <NavDropdown.Item href="/settings">Settings</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="/logout">Logout</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>

                }
                {
                    !isLoggedIn
                    &&
                                        
                    <Nav className="justify-content-end">
                        <Nav.Item>
                            <Nav.Link href="/signup">Sign up</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href="/login">Login</Nav.Link>
                        </Nav.Item>
                    </Nav>

                }
            </Navbar.Collapse>
        </Navbar>
    );
}

export default NavComponent;