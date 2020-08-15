import GoalComponents from 'features/goal/goal.components';
import GoalModal from 'features/goal/goal.modal';
import { WeekActionType } from 'features/week/week.actions';
import actionManager from 'framework/ActionManager';
import Utility from 'framework/Utility';
import React, { useEffect, useState } from 'react';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import { shallowEqual, useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import weekService from './week.service';





export default function WeekComponent( props: any ) {

    console.log("WeekComponent: enterred");

    const goalAdded = useSelector( (state:RootState) => { return state.weekState.goalAdded } );
    const taskViewFromStore: any = useSelector<any>((state:RootState) => {  return state.weekState.taskView }, shallowEqual);
    console.log("goalAdded:" + goalAdded);
    // const weekUpdatedAt = useSelector( (state:RootState) => { return state.weekState.weekDetails.weekUpdatedAt } );
    // const weekDetailsFromStore = weekService.getFromStore();
    const weekDetails = weekService.getFromStore();
    const [taskView, setTaskView] = useState<boolean>(false);
    // console.log("WeekComponent: weekDetailsFromStore:");
    // console.log(weekDetails);

    // const[weekDetails, setWeekDetails] = useState<any>(null);

    function getMenubar(props: any) {
        let taskViewChecked = "";
        if (taskView) {
            taskViewChecked = "checked";
        }
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
                        
                        <b>Schedule: Weekdays</b>
                        
                    </div>
                    {/* <div className='p-2'>
                        
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
                        
                    </div> */}
                    <Button variant='info' size='sm' onClick={() => showGoalModal(null)}>+ NEW GOAL &nbsp;</Button>
                    { getGoalModal(null) }
                    <div className='p-2'>
                        
                        <b>View: </b>
                        
                    </div>
                    <div className='p-2'>
                        
                        <Form.Check 
                            type="switch"
                            id="custom-switch"
                            label="Task view"
                            checked={taskView}
                            onChange={(e: any) => {
                                // console.log("WeekComponent: taskView dispatching: " + e.target.checked );
                                actionManager.dispatch(WeekActionType.SET_TASK_VIEW, { taskView: e.target.checked });

                            }}
                        />
                        
                    </div>
                </div>
            </Row>
        );
    }

    function getSummaryCard(props: any) {
        const progress = Utility.hoursFromMinutes(weekDetails.completedMinutes / weekDetails.totalMinutes);
        return (

            <Card className='week-category-card d-lg-block d-md-none'>
                    
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
            <GoalComponents taskView={taskView} />
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
        console.log("WeekComponent: all render useEffect taskView: " + taskView);
        console.log("WeekComponent: all render useEffect taskViewFromStore: " + taskViewFromStore);
        if (taskView != taskViewFromStore ) {
            console.log("WeekComponent: setTaskView");
            setTaskView(taskViewFromStore);
        }
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
                <div className="d-flex goalCardsContainer col-lg-9 col-md-12">

                    { getGoalCards() }

                </div>
                
                {/* <Container className='goalCardsContainer'>
                    <Row>
                        { getGoalCards() }
                    </Row>
                </Container> */}
                    

                {/* New goal form */}
            </Row>
        </Container>

    );

}