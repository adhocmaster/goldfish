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
import { useSelector, shallowEqual } from 'react-redux';
import actionManager from 'framework/ActionManager';
import { WeekActionType } from 'features/week/week.actions';
import weekService from 'features/week/week.service';
import GoalService from './goal.service';
import goalService from './goal.service';
import Utility from 'framework/Utility';
import toastService from 'app/toast.service';
import deepEqual from 'deep-equal';
import TaskComponent from './task.component';

export default function GoalModal(props: any): any {


    const showGoalModal = useSelector( (state:RootState) => { return state.weekState.showGoalModal } );
    // after a goal is created we need to add it to the week. This state helps with steps.
    const isNewGoalCreated = useSelector( (state:RootState) => { return state.weekState.isNewGoalCreated } ); 

    const goalId = useSelector((state: RootState) => { return state.goalState.id });
    const titleFromStore = useSelector((state: RootState) => { return state.goalState.title });
    const totalMinutesFromStore = useSelector((state: RootState) => { return state.goalState.totalMinutes });

    const [weekDetails, setWeekDetails] = useState({});
    const [title, setTitle] = useState<string>(titleFromStore);
    const [totalMinutes, setTotalMinutes] = useState<number>(totalMinutesFromStore);
    const [totalHours, setTotalHours] = useState<number>(0);
    const [availableMinutes, setAvailableMinutes] = useState<number>(0);
    const [availableHours, setAvailableHours] = useState<number>(0);
    

    useEffect(() => {

        console.log("initializing goal modal");
        if ( !deepEqual(props.weekDetails, weekDetails)) {
            
            console.log("Calling setWeekDetails In Goal Modal");
            setWeekDetails(props.weekDetails);
            setAvailableMinutes(weekService.getAvaiableMinutes(props.weekDetails));
            setAvailableHours(weekService.getAvailableHours(props.weekDetails));
        }


        // if (existingGoal) {

        //     setGoalId(existingGoal.categoryId);
        //     setTitle(existingGoal.title);
        //     setPlannedMinutes(existingGoal.plannedMinutes);
    
        // }
        setTotalHours(Utility.hoursFromMinutes(totalMinutes));

        if (isNewGoalCreated) {
            
            submit();

        }
    
    });

    function hide() {

        actionManager.dispatch(WeekActionType.HIDE_GOAL_FORM);

    }

    function submit() {

        //  user service to submit. dispatch actions based on the result.
        // actionManager.dispatch(WeekActionType.SUBMIT_GOAL_FORM);

        // new goal or old goal?
        console.log("goalId: " + goalId);
        if (!goalId) {
            // need to create the goal first.
            goalService.create({
                title: title
            })
        } else {
            // we have a goal id. Gotta add/update to the week.
            let goal = { 

                categoryId: goalId,
                title: title,
                totalMinutes: totalMinutes
    
            };
            try {

                weekService.addGoalToWeek(weekDetails, goal);

            } catch(e) {
                toastService.error(e.message);
            }

        }



        // weekService.createGoal(weekDetails,);

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

    if (!weekDetails) {
        return(
            <Spinner animation="grow" />
        )
    }

    return (
        <>
            <Modal show={showGoalModal} onHide={() => onHide()} dialogClassName="goal-modal">
                <Modal.Body>
                    <Container>
                        
                        <div className='text-info' style={{marginBottom: '0.5em', fontWeight:"bold", fontSize: '1.1rem'}}>
                            Type title or select from favorites. {goalId}
                        </div>
                        <Row className='justify-content-around'>
                            <Card className='week-category-card' style={{width:'18rem'}}>
                                
                                <Card.Body>
                                    
                                    <div className='text-info' style={{marginBottom: '0.5em'}}>
                                    </div>
                                    <Form.Group>
                                        <Form.Label>Title</Form.Label>
                                        <Form.Control type="text" placeholder='Type title of the goal'                                         
                                            value={title}
                                            onChange={e => {
                                                setTitle(e.target.value);
                                            }}
                                        />
                                    </Form.Group>
                                    
                                    <Form.Group>
                                        
                                        <Form.Label>Allocate: ({totalHours} of {availableHours} h)</Form.Label>
                                        <Form.Control type="range" min={30} max={availableMinutes} step={30}                                          
                                            value={totalMinutes}
                                            onChange={e => {
                                                setTotalMinutes(parseInt(e.target.value));
                                                setTotalHours(Utility.hoursFromMinutes(totalMinutes));
                                            }}/>
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


export function GoalComponent(props: any): any {

    console.log("GoalComponent: enterred");
    const goalStatesFromStore: any = useSelector<any>((state:RootState) => { return state.weekState.goalStates}, deepEqual);
    const weekDetailsFromStore: any = useSelector<any>((state:RootState) => { return state.weekState.weekDetails}, deepEqual);
    const weekIdFromStore: any = useSelector<any>((state:RootState) => {  return state.weekState.weekId }, shallowEqual);
    const [goals, setGoals] = useState<any>({});
    const [weekId, setWeekId] = useState<any>({});
    console.log("GoalComponent: goalStatesFromStore");
    console.log(goalStatesFromStore);
    useEffect(() => {
        console.log("GoalComponent: useEffect");
        // if( !deepEqual(goals, goalStatesFromStore)) {
        //     console.log('calling setGoals');
        //     setGoals(goalStatesFromStore);
        // }

        // if ( weekId != weekIdFromStore ) {
        //     console.log('calling setWeekId');
        //     setWeekId(weekIdFromStore);
        // }
    });

    let cards = [];
    let goal: any;
    for (goal of Object.values(goalStatesFromStore)) {

        const progress = Utility.hoursFromMinutes(goal.completedMinutes / goal.totalMinutes);
        cards.push(
            <Card className='week-category-card'>
                    
                <Card.Body>
                    <div className='header'>
                        <b>{goal.title}</b>
                        <div className="float-right">
                        {Utility.hoursFromMinutes(goal.plannedMinutes)} of {Utility.hoursFromMinutes(goal.totalMinutes)}
                        </div>
                        <ProgressBar now={progress} label={`${progress}%`} variant="info" />
                    </div>
                    {
                        getTaskComponents(goal.tasks)
                    }
                </Card.Body>
                <Card.Footer>
                    {
                        getNewTaskForm(weekId, goal)
                    }
                </Card.Footer>
            </Card>

        )
    }

    console.log("GoalComponent: rendering");
    return cards;

    // **************************** functions **************************************//
    
    function getTaskComponent(task: any) {
        return (
            
            <Card className='task-card' id={`task-${task.taskNo}`}>
                <Card.Body>
                    <Badge className='float-right'>--</Badge>
                    <div>{task.title}</div>
                </Card.Body>
            </Card>
        );
    }


    function getTaskComponents(tasks: any[]) {

        let taskItems = [];
        if (!tasks) {
            return <></>;
        }

        for (let task of tasks) {
            taskItems.push(getTaskComponent(task));
        }

        return taskItems;

    }

    function addTask(categoryId: string) {
        toastService.message(`Going to add tasks soon under category ${categoryId}`);
    }

    function getNewTaskForm(weekId: string, goal: any) {


        // if(!weekDetails || !categoryId) return;
        // console.log(weekDetails);
        return (
            <TaskComponent weekDetails={weekDetailsFromStore} goal={goal} />
        );
    }

}