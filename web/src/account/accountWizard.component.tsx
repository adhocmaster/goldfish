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
import { ActionType } from 'app/actionTypes';
import toastService from 'app/toast.service';
import DefaultGoalComponent from 'features/goal/defaultGoal.component';

export default function AccountWizardComponent(props: any) {

    const [isError, setIsError] = useState(false);
    const [name, setName] = useState("");
    const [email, setemail] = useState("");
    const [password, setPassword] = useState("");

    const nextAction: string | undefined = useSelector((state: RootState) => { return state.settingsState.nextAction} );
    const settingsState: string | undefined = useSelector((state: RootState) => { return state.settingsState} );
    const isLoggedIn: boolean = useSelector((state: RootState) => { return state.settingsState.isLoggedIn} );

    const errors: string[] = useSelector((state: RootState) => { return state.settingsState.loginErrors} );


    // console.log(userService.isLoggedIn())
    if (!userService.isLoggedIn()) {

        return (<Redirect to="/login"></Redirect>);

    }

    console.log(settingsState);
    console.log("AccountWizardComponent: nextAction " + nextAction);

    switch(nextAction) {
        case ActionType.NEXT_ACTION_HIW:
            return getHIW();
        case ActionType.NEXT_ACTION_DG:
            return getDGForm();
        
        case ActionType.NEXT_ACTION_DWS:
            return getDWSForm();
        
        case ActionType.NEXT_ACTION_DWT:
            return getDWTForm();

        default:
            return (<Redirect to="/week"></Redirect>);


    }

    function saveDefaultGoals() {
        
    }

    function getHIW() {
        
        return (
            <Container className="login-container" >
                <Row className="justify-content-md-center">
                    App wizard
                    How it works
                    <Button variant="primary"
                        onClick={(e: any) => {
                            userService.nextAction();
                        }}
                    >
                        Skip
                    </Button>
                </Row>
            </Container>
        );
    };

    function getDGForm() {
        
        return (<DefaultGoalComponent />);
    };

    function getDWSForm() {
        
        return (
            <Container className="login-container" >
                <Row className="justify-content-md-center">
                    App wizard
                    getDWSForm
                    <Button variant="primary"
                        onClick={(e: any) => {
                            userService.nextAction();
                        }}
                    >
                        Skip
                    </Button>
                </Row>
            </Container>
        );
    };
    function getDWTForm() {
        
        return (
            <Container className="login-container" >
                <Row className="justify-content-md-center">
                    App wizard
                    getDWTForm
                    <Button variant="primary"
                        onClick={(e: any) => {
                            userService.nextAction();
                        }}
                    >
                        Skip
                    </Button>
                </Row>
            </Container>
        );
    };
    
}
