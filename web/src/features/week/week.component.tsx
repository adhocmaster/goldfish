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


export default function WeekComponent( props: any ) {

    let count = 0;
    console.log("enterred week component");

    const goalAdded = useSelector( (state:RootState) => { return state.weekState.goalAdded } );
    console.log("goalAdded:" + goalAdded);
    // const weekUpdatedAt = useSelector( (state:RootState) => { return state.weekState.weekDetails.weekUpdatedAt } );
    const weekDetailsFromStore = weekService.getFromStore();
    // console.log("weekDetailsFromStore:" + weekDetailsFromStore);

    const[weekDetails, setWeekDetails] = useState<any>(null);
    const[rerender, setRerender] = useState(false);

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
    // function getTaskComponent(task: any) {
    //     return (
            
    //         <Card className='task-card' id={`task-${task.taskNo}`}>
    //             <Card.Body>
    //                 <Badge className='float-right'>--</Badge>
    //                 <div>{task.title}</div>
    //             </Card.Body>
    //         </Card>
    //     );
    // }


    // function getTaskComponents(tasks: any[]) {

    //     let taskItems = [];
    //     if (!tasks) {
    //         return <></>;
    //     }

    //     for (let task of tasks) {
    //         taskItems.push(getTaskComponent(task));
    //     }

    //     return taskItems;

    // }

    // function addTask(categoryId: string) {
    //     toastService.message(`Going to add tasks soon under category ${categoryId}`);
    // }

    // function getNewTaskForm(categoryId: string) {

    //     if(!weekDetails || !categoryId) return;
    //     // console.log(weekDetails);
    //     return (
    //         <TaskComponent weekDetails={weekDetails} goalId={categoryId} />
    //     );
    // }

    function getGoalCards() {

        // if(!weekDetails) return;

        // let cards = [];
        // for (let categorizedTask of weekDetails.categorizedTasks) {

            
        //     cards.push(
        //         <Card className='week-category-card'>
                        
        //             <Card.Body>
        //                 <div className='header'>
        //                     <b>{categorizedTask.title}</b>
        //                     <div className="float-right">
        //                         4 of 22
        //                     </div>
        //                     <ProgressBar now={(11*100)/22} label={`${(11*100)/22}%`} variant="info" />
        //                 </div>
        //                 {
        //                     getTaskComponents(categorizedTask.tasks)
        //                 }
        //             </Card.Body>
        //             <Card.Footer>
        //                 {
        //                     getNewTaskForm(categorizedTask.categoryId)
        //                 }
        //             </Card.Footer>
        //         </Card>

        //     )
        // }
        // return cards;

        return (
            <GoalComponent />
        )
    }

    useEffect(() => {

        count = 1;
        console.log("first render");
        // if (!weekDetailsFromStore) {
        // } 
        weekService.getById('5f311ccd8c32ed4bf89f9fc1', true);
        setRerender(true);
        // if (props.weekId) {
        //     weekService.getById(props.weekId);
        // } else if (props.startDate) {
        //     weekService.getByStartDate(props.startDate);
        // } else {
        //     weekService.getClosestWeek();
        // }

    }, []);

    useEffect(() => {

        console.log("all render useEffect week component");
        // console.log(weekDetails);
        // console.log(weekDetailsFromStore);
        // console.log("printed weekDetails and weekDetailsFromStore");
        if (weekDetailsFromStore.id && !deepEqual(weekDetailsFromStore, weekDetails)) {
            
            console.log("calling setWeekDetails");
            setWeekDetails(weekDetailsFromStore);
        }
        // if (props.weekId) {
        //     weekService.getById(props.weekId);
        // } else if (props.startDate) {
        //     weekService.getByStartDate(props.startDate);
        // } else {
        //     weekService.getClosestWeek();
        // }

    });


    console.log("after all useEffects");
    
    // console.log(weekDetails);

    if (!weekDetails) {
        return(
            <Spinner animation="grow" />
        )
    }
    // return(
    //     <Spinner animation="grow" />
    // )

    console.log(weekDetails);

    return (

        <Container>
            {/* Week menu bar */}
            { getMenubar(weekDetails) }
            {/* Week cards */}
            <Row>
                {/* Week Summary Card */}
                { getSummaryCard(null) }

                {/* Week Goal Cards */}
                {getGoalCards()}
                    

                {/* New goal form */}
            </Row>
        </Container>

    );

}