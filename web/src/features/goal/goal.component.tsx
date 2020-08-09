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
import Modal from 'react-bootstrap/Modal';

import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import actionManager from 'framework/ActionManager';
import { WeekActionType } from 'features/week/week.actions';
import weekService from 'features/week/week.service';

export default function GoalModal(props: any): any {

    const showGoalModal = useSelector( (state:RootState) => { return state.weekState.showGoalModal } )

    function hide() {

        actionManager.dispatch(WeekActionType.HIDE_GOAL_FORM);

    }

    function submit() {

        //  user service to submit. dispatch actions based on the result.
        // actionManager.dispatch(WeekActionType.SUBMIT_GOAL_FORM);

        weekService.createGoal(null);

    }

    function onHide() {
        
        actionManager.dispatch(WeekActionType.HIDE_GOAL_FORM);

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


    return (
        <>
            <Modal show={showGoalModal} onHide={() => onHide()} dialogClassName="goal-modal">
                <Modal.Body>
                    <Container>
                        
                        <div className='text-info' style={{marginBottom: '0.5em', fontWeight:"bold", fontSize: '1.1rem'}}>
                            Type title or select from favorites.
                        </div>
                        <Row className='justify-content-around'>
                            <Card className='week-category-card' style={{width:'18rem'}}>
                                
                                <Card.Body>
                                    
                                    <div className='text-info' style={{marginBottom: '0.5em'}}>
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

                        </Row>
                    </Container>

                </Modal.Body>
                <Modal.Footer>
                    <Button size='sm' variant="secondary" onClick={() => hide()}>
                    Close
                    </Button>
                    <Button size='sm' variant="primary" onClick={() => submit()}>
                    Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}