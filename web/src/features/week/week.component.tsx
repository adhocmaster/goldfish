import React from 'react';
import ReduxUIComponent from '../../framework/ReduxUIComponent';
import { RootState, store } from '../../app/store';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import Alert from 'react-bootstrap/ProgressBar';
import ProgressBar from 'react-bootstrap/ProgressBar';
import FormControl from 'react-bootstrap/FormControl';

import { Link } from 'react-router-dom';


export default function WeekComponent( props: any ) {

    function getMenubar(props: any) {
        return (

            <Row>
                <div  className='second-nav d-flex flex-row align-items-center'>
                    <div className='title p-2'>
                        Week 1
                    </div>
                    <div className='p-2'>
                        08/02/2020 - 08/09-2020
                    </div>
                    <div className='p-2'>
                        
                        <b>Schedule based on: </b>
                        
                    </div>
                    <div className='p-2'>
                        
                        <Form.Check
                            name="scheduleType"
                            inline
                            label="Weekdays"
                            type='radio'
                            id='schedule-type-1'
                        />
                        
                        <Form.Check
                            name="scheduleType"
                            inline
                            label="Weekends"
                            type='radio'
                            id='schedule-type-2'
                        />

                        <Form.Check
                            name="scheduleType"
                            inline
                            label="Both"
                            type='radio'
                            id='schedule-type-3'
                        />
                        
                    </div>
                    <Button variant='info' size='sm'>+ NEW GOAL &nbsp;</Button>
                </div>
            </Row>
        );
    }

    function getSummaryCard(props: any) {

        return (

            <Card className='week-category-card'>
                    
                <Card.Body>
                    <div className='header'>
                        <b>Summary</b>
                        <ProgressBar now={15} label={`${15}%`} variant="success" />
                        <br></br>
                        <div className='form-row'>
                            <div className='col'>
                                Success chance
                            </div>
                            <div className='col'>
                                :&nbsp;
                                <Badge key='1' variant='danger'>
                                    Low
                                </Badge>
                            </div>
                        </div>
                        <div className='form-row'>
                            <div className='col'>
                                Schedule type
                            </div>
                            <div className='col'>
                            : Week day
                            </div>
                        </div>
                        <div className='form-row'>
                            <div className='col'>
                                Time in week
                            </div>
                            <div className='col'>
                            : 60 h
                            </div>
                        </div>
                        <div className='form-row'>
                            <div className='col'>
                                Available
                            </div>
                            <div className='col'>
                            : 15 h
                            </div>
                        </div>
                        <div className='form-row'>
                            <div className='col'>
                                Planned
                            </div>
                            <div className='col'>
                            : 40 h
                            </div>
                        </div>
                        <div className='form-row'>
                            <div className='col'>
                                Completed
                            </div>
                            <div className='col'>
                                : 10.5 h
                            </div>
                        </div>
                        <div className='form-row'>
                            <div className='col'>
                                Due
                            </div>
                            <div className='col text-danger'>
                                : 29.5 h
                            </div>
                        </div>
                        <div className='form-row'>
                            <div className='col'>
                                Progress
                            </div>
                            <div className='col'>
                                : 15%
                            </div>
                        </div>
                    </div>
                </Card.Body>
                <Card.Footer>
                    {
                        getNewTaskForm()
                    }
                </Card.Footer>
            </Card>
        );
    }


    function getNewGoalForm() {
        return (
            <>
                <Card className='week-category-card'>
                        
                    <Card.Body>
                        
                        <div className='text-info' style={{marginBottom: '0.5em'}}>
                            Select from Favorites or type new.
                        </div>
                        <Form.Group>
                            <Form.Label>Title</Form.Label>
                            <Form.Control type="text" placeholder='Type title of the goal' />
                        </Form.Group>
                        
                        <Form.Group>
                            
                            <Form.Label>Allocate: (5.5 of 23 h)</Form.Label>
                            <Form.Control type="range" min={0} max={50} step={0.5} />
                        </Form.Group>
                        
                        <Form.Group>
                            <Form.Check
                                name="addToFavorite"
                                inline
                                label="Add to Favorites"
                                type='checkbox'
                                id='schedule-type-1'
                            />
                        </Form.Group>

                        <Button variant='secondary' size='sm'>
                            + ADD
                        </Button>
                        <br></br>
                        
                    </Card.Body>
                </Card>
                <Card className='week-category-card'>
                        
                    <Card.Body>
                        
                        <div className='header'>
                            <b>Pick from Favorites</b>
                            <div className="float-right">
                                4 of 22
                            </div>
                            { getFavoriteComponent() }
                        </div>
                        
                    </Card.Body>
                </Card>
            </>
        );
    }

    function getFavoriteComponent() {
        return (
            
            <Card className='task-card favorite'>
                <Card.Body>
                    <div>{`<<`} Guitar</div>
                </Card.Body>
            </Card>
        );
    }

    function getTaskComponent() {
        return (
            
            <Card className='task-card'>
                <Card.Body>
                    <Badge className='float-right'>--</Badge>
                    <div>This is a task</div>
                </Card.Body>
            </Card>
        );
    }

    function getNewTaskForm() {
        return (
            <>
                <Form.Group>
                    <Form.Control as="textarea" rows={1} placeholder='Type title of the task'> 

                    </Form.Control>
                </Form.Group>
                <Button variant='secondary' size='sm'>
                    + ADD
                </Button>
            </>
        );
    }

    return (

        <Container>
            {/* Week menu bar */}
            { getMenubar(null) }
            {/* Week cards */}
            <Row>
                {/* Week Summary Card */}
                { getSummaryCard(null) }

                {/* Week Goal Cards */}
                    
                <Card className='week-category-card'>
                    
                    <Card.Body>
                        <div className='header'>
                            <b>Guitar</b>
                            <div className="float-right">
                                4 of 22
                            </div>
                            <ProgressBar now={(11*100)/22} label={`${(11*100)/22}%`} variant="info" />
                        </div>
                        {
                            getTaskComponent()
                        }
                    </Card.Body>
                    <Card.Footer>
                        {
                            getNewTaskForm()
                        }
                    </Card.Footer>
                </Card>

                {/* New goal form */}
                { getNewGoalForm() }
            </Row>
        </Container>

    );

}