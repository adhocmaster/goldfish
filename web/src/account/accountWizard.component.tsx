import React, { useEffect, useState } from 'react';
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

    const [errors, setErrors] = useState<string[]>([]);

    // elements for default week schedule
    
    const [hoursPerWeekDays, setHoursPerWeekDays] = useState<number>(0);
    const [hoursPerWeekWeekends, setHoursPerWeekends] = useState<number>(0);
    const hoursPerWeekDaysStore = userService.getHoursPerWeekDays();
    const hoursPerWeekWeekendsStore = userService.getHoursPerWeekWeekends();
    


    useEffect(() => {
        if (hoursPerWeekDaysStore) {
            if (hoursPerWeekDaysStore!= hoursPerWeekDays) {
                setHoursPerWeekDays(hoursPerWeekDaysStore);
            }
        }

        if (hoursPerWeekWeekendsStore) {
            if (hoursPerWeekWeekendsStore != hoursPerWeekWeekends) {
                setHoursPerWeekends(hoursPerWeekWeekendsStore);
            }
        }

    });

    // console.log(userService.isLoggedIn())
    if (!userService.isLoggedIn()) {

        return (<Redirect to="/login"></Redirect>);

    }

    // console.log(settingsState);
    // console.log("AccountWizardComponent: nextAction " + nextAction);

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
                <h1>Account Setup</h1>
                <Row className="justify-content-md-center">
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

    function getDWTForm() {
        
        return (
            <Container className="login-container" >
                <h1>Account Setup</h1>
                <Row className="justify-content-md-center">
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

    function getDWSForm() {
        
        return (
            <Container className="login-container" >
                <h1>Account Setup</h1>
                <Row className="justify-content-md-center">
                    <Card id="default-goal-form" style={{ width: '18rem', margin: "10px" }}>
                        <Card.Body>
                            <Card.Title>Dedicate some time every week!</Card.Title>
                            <Form.Group>
                                <Form.Label>Hours during weekdays:</Form.Label>
                                <Form.Control type="text"
                                    value={hoursPerWeekDays}
                                    onChange={e => {
                                        let hours = parseInt(e.target.value);

                                        if (hours < 0) {
                                            toastService.error("hours cannot be negative");
                                        } else {
                                            setHoursPerWeekDays(hours);
                                        }
                                    }} />
                                <Form.Text className="text-muted">Don't add your working hours.
                                </Form.Text>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Hours during weekends:</Form.Label>
                                <Form.Control type="text"
                                    value={hoursPerWeekWeekends}
                                    onChange={e => {
                                        let hours = parseInt(e.target.value);

                                        if (hours < 0) {
                                            toastService.error("hours cannot be negative");
                                        } else {
                                            setHoursPerWeekends(hours);
                                        }
                                    }} />
                                <Form.Text className="text-muted">Don't add your entertainment hours.
                                </Form.Text>
                            </Form.Group>

                            <br/>
                            <div>
                                {errors.length > 0 && 
                                    <Alert variant="warning">
                                        {Utility.getListRep(errors)}
                                    </Alert>
                                }
                            </div>
                        </Card.Body>
                        <Card.Footer>
                        
                            <Button size='sm'  variant="primary" type="submit" onClick={(e: any) => {

                                userService.saveDWT(hoursPerWeekDays, hoursPerWeekWeekends);

                                }}>
                                    SAVE
                            </Button> &nbsp;
                            <Button  size='sm'  variant="primary"
                                onClick={(e: any) => {
                                    userService.nextAction();
                                }}
                            >
                                NEXT
                            </Button>
                        </Card.Footer>
                    </Card>
                </Row>
            </Container>
        );
    };
    
}
