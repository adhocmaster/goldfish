import React, { useEffect } from 'react';
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
import Spinner from 'react-bootstrap/Spinner';

import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useSelector } from 'react-redux';

import GoalModal, { GoalComponent } from 'features/goal/goal.component';
import TaskComponent from 'features/goal/task.component';
import actionManager from 'framework/ActionManager';
import { WeekActionType } from 'features/week/week.actions';
import weekService from './week.service';
import toastService from 'app/toast.service';
import deepEqual from 'deep-equal';
import Utility from 'framework/Utility';


export default function WeekComponent( props: any ) {

    console.log("WeekComponent: enterred");

    const goalAdded = useSelector( (state:RootState) => { return state.weekState.goalAdded } );
    console.log("goalAdded:" + goalAdded);
    // const weekUpdatedAt = useSelector( (state:RootState) => { return state.weekState.weekDetails.weekUpdatedAt } );
    // const weekDetailsFromStore = weekService.getFromStore();
    const weekDetails = weekService.getFromStore();
    // console.log("WeekComponent: weekDetailsFromStore:");
    // console.log(weekDetails);

    // const[weekDetails, setWeekDetails] = useState<any>(null);

    function getMenubar(props: any) {
        return (

            <Row>
                <div  className='second-nav d-flex flex-row align-items-center'>
                    <div className='title p-2'>
                        Week {weekService.getWeekOfTheYear(weekDetails)}
                    </div>
                    <div className='p-2'>
                        {weekService.getLocalStartDateString(weekDetails)}
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
                    <Button variant='info' size='sm' onClick={() => showGoalModal(null)}>+ NEW GOAL &nbsp;</Button>
                    { getGoalModal(null) }
                </div>
            </Row>
        );
    }

    function getSummaryCard(props: any) {
        const progress = Utility.hoursFromMinutes(weekDetails.completedMinutes / weekDetails.totalMinutes);
        return (

            <Card className='week-category-card'>
                    
                <Card.Body>
                    <div className='header'>
                        <b>Summary</b>
                        <ProgressBar 
                            min={5}
                            now={progress} 
                            label={`${ progress }%`} variant="success" />
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
                            : {weekDetails.schedule}
                            </div>
                        </div>
                        <div className='form-row'>
                            <div className='col'>
                                Time in week
                            </div>
                            <div className='col'>
                                : { Utility.hoursFromMinutes(weekDetails.totalMinutes) } h
                            </div>
                        </div>
                        <div className='form-row'>
                            <div className='col'>
                                Available
                            </div>
                            <div className='col'>
                                : { Utility.hoursFromMinutes(weekDetails.totalMinutes -  weekDetails.plannedMinutes) } h
                            </div>
                        </div>
                        <div className='form-row'>
                            <div className='col'>
                                Planned
                            </div>
                            <div className='col'>
                                : { Utility.hoursFromMinutes(weekDetails.plannedMinutes) } h
                            </div>
                        </div>
                        <div className='form-row'>
                            <div className='col'>
                                Completed
                            </div>
                            <div className='col'>
                                : { Utility.hoursFromMinutes(weekDetails.completedMinutes) } h
                            </div>
                        </div>
                        <div className='form-row'>
                            <div className='col'>
                                Due
                            </div>
                            <div className='col text-danger'>
                                : { Utility.hoursFromMinutes(weekDetails.totalMinutes - weekDetails.completedMinutes) } h
                            </div>
                        </div>
                        <div className='form-row'>
                            <div className='col'>
                                Progress
                            </div>
                            <div className='col'>
                                : { Utility.hoursFromMinutes(weekDetails.completedMinutes / weekDetails.totalMinutes) } h
                            </div>
                        </div>
                    </div>
                </Card.Body>
            </Card>
        );
    }

    function getGoalModal(props: any): any {

        // console.log("creating goal modal. checking week detauls");
        // console.log(weekDetails);
        return (
            <>
                {<GoalModal weekDetails={weekDetails} />}
            </>
        );
    }

    function showGoalModal(props: any) {

        actionManager.dispatch(WeekActionType.SHOW_GOAL_FORM);

    }

    function getGoalCards() {

        return (
            <GoalComponent />
        )
    }

    useEffect(() => {

        console.log("WeekComponent: one time useEffect!");
        weekService.getById('5f311ccd8c32ed4bf89f9fc1', true);

    }, []);

    useEffect(() => {

        console.log("WeekComponent: all render useEffect");
        
        // console.log(weekDetails);
        // console.log(weekDetailsFromStore);
        // console.log("printed weekDetails and weekDetailsFromStore");
        // if (weekDetailsFromStore.id && !deepEqual(weekDetailsFromStore, weekDetails)) {
            
        //     console.log("calling setWeekDetails");
        //     setWeekDetails(weekDetailsFromStore);
        // }

    });


    console.log("WeekComponent: after all useEffects");
    

    if (!weekDetails || !weekDetails.id) {
        return(
            <div className="d-flex flex-column justify-content-center align-items-center week-loader">
                <div>. . . Loading your life . . .</div>
                <br/>
                <Spinner animation="grow" variant="warning" />
            </div>
        )
    }

    // console.log(weekDetails);
    console.log("WeekComponent: rendering");

    return (

        <Container>
            {/* Week menu bar */}
            { getMenubar(weekDetails) }
            {/* Week cards */}
            <Row className=''>
                {/* Week Summary Card */}
                { getSummaryCard(null) }

                {/* Week Goal Cards */}
                {getGoalCards()}
                    

                {/* New goal form */}
            </Row>
        </Container>

    );

}