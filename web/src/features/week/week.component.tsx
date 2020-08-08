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
import ProgressBar from 'react-bootstrap/ProgressBar';
import FormControl from 'react-bootstrap/FormControl';

import { Link } from 'react-router-dom';


export default function WeekComponent( props: any ) {

    function getTaskComponent() {
        return (
            
            <Card className='task-card'>
                <Card.Body>
                    This is a task
                </Card.Body>
            </Card>
        );
    }

    return (

        <Container>
            <Row>
                <div id='second-nav' className='d-flex flex-row align-items-center'>
                    <div className='title p-2'>
                        Week 1
                    </div>
                    <div className='p-2'>
                        08/02/2020 - 08/09-2020
                    </div>
                </div>
            </Row>
            <Row>
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
                        <div className='footer'>
                            <Form.Group>
                                <Form.Control as="textarea" rows={2}> 

                                </Form.Control>
                            </Form.Group>
                            <Button variant='secondary' size='sm'>
                                + Add
                            </Button>
                        </div>
                    </Card.Body>
                </Card>
                <Card className='week-category-card'>
                    <Card.Header>
                        <b>Guitar</b>
                        <div className="float-right">
                            4 of 22
                        </div>
                        <ProgressBar now={(11*100)/22} label={`${(11*100)/22}%`} variant="info" />
                    </Card.Header>
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

                        {
                            getTaskComponent()
                        }

                        {
                            getTaskComponent()
                        }

                    </Card.Body>
                    <Card.Footer>
                        <Form.Group>
                            <Form.Control as="textarea" rows={2}> 

                            </Form.Control>
                        </Form.Group>
                        <Button variant='secondary' size='sm'>
                            + Add
                        </Button>
                    </Card.Footer>
                </Card>
            </Row>
        </Container>

    );

}