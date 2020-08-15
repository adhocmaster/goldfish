import React, { useEffect, createRef } from 'react';
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

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusSquare, faPlusCircle, faList } from '@fortawesome/free-solid-svg-icons';


export default function GoalComponent(props: any): any {

    console.log(props.goal.categoryId + " GoalComponent: enterred");
    // console.log(props);
    const goalStatesFromStore: any = useSelector<any>((state:RootState) => { return state.weekState.goalStates}, deepEqual);
    const weekDetailsFromStore: any = useSelector<any>((state:RootState) => { return state.weekState.weekDetails}, deepEqual);
    const weekIdFromStore: any = useSelector<any>((state:RootState) => {  return state.weekState.weekId }, shallowEqual);
    const taskViewFromStore: any = useSelector<any>((state:RootState) => {  return state.weekState.taskView }, shallowEqual);
    const [goal, setGoal] = useState<any>(props.goal);
    const [weekId, setWeekId] = useState<any>({});
    const [isTaskView, setTaskView] = useState<boolean>(false);
    const [isLocalTaskView, setLocalTaskView] = useState<boolean| undefined>(undefined);
    const [newCompleteMinutes, setNewCompleteMinutes] = useState(0);

    const taskListRef = createRef<HTMLDivElement>();

    // console.log(goal.categoryId + " GoalComponent: goalStatesFromStore");
    // console.log(goalStatesFromStore[goal.categoryId]);
    useEffect(() => {
        // console.log(goal.categoryId + " GoalComponent: useEffect");
        // console.log(goal.categoryId + " GoalComponent: isTaskView: " + isTaskView);
        // console.log(goal.categoryId + " GoalComponent: taskViewFromStore: " + taskViewFromStore);
        // console.log(goal.categoryId + " GoalComponent: isLocalTaskView: " + isLocalTaskView);

        // if localTaskView is true, isTaskView is true, if not synch with taskViewFromStore

        if (isLocalTaskView === undefined) {

            if (isTaskView != taskViewFromStore) {
    
                // console.log(goal.categoryId + " GoalComponent: setTaskView from taskViewFromStore");
                setTaskView(taskViewFromStore);
                
            }

        } else if (isLocalTaskView !== isTaskView) {
            setTaskView(isLocalTaskView);
        }

        if (!deepEqual(goal, goalStatesFromStore[goal.categoryId])) {
            // console.log(goal.categoryId + " GoalComponent: setGoal");
            setGoal(goalStatesFromStore[goal.categoryId]);
        }

    
    });

    let cards = [];


    let goldCardView: any;
    if (isTaskView) {

        goldCardView = <>{getTaskComponent(goal)} </>;

    } else {

        goldCardView = getNonTaskComponent(goal);

    }

    const progress = Utility.hoursFromMinutes(goal.completedMinutes / goal.totalMinutes);
    console.log(goal.categoryId + " GoalComponent: rendering");
    return (
        <Card className='week-category-card'>
                
            <Card.Body>
                <div className='header'>
                    <b>{goal.title}</b>
                    <div className="float-right">
                        {Utility.hoursFromMinutes(goal.completedMinutes)}/{Utility.hoursFromMinutes(goal.totalMinutes)} h
                        
                    </div>
                    <ProgressBar min={5} now={progress} label={`${progress}%`} variant="info" />
                </div>
                {
                    goldCardView
                }
            </Card.Body>
            <Card.Footer>
                {
                    isTaskView &&
                    getNewTaskForm(weekId, goal)
                }
            </Card.Footer>
        </Card>

    )

    // **************************** funct+ions **************************************//
    

    function getNonTaskComponent(goal: any) {
        let tasks:[] = goal.tasks;

        let goalAvailableMinutes = goal.totalMinutes - goal.completedMinutes - goal.plannedMinutes;
        if (!goalAvailableMinutes) goalAvailableMinutes = 0;
        let goalAvailableHours = Utility.hoursFromMinutes(goalAvailableMinutes);
        let goalTotalHours = Utility.hoursFromMinutes(goal.totalHours);
        let completedHours = Utility.hoursFromMinutes(goal.completedMinutes + newCompleteMinutes);

        let plannedTaskHourMessage = <span>No planned tasks.</span>;
        if (goal.plannedMinutes && goal.plannedMinutes != 0) {
            plannedTaskHourMessage = <span>{Utility.hoursFromMinutes(goal.plannedMinutes)} h planned in tasks.</span>;
        }

        return (
            <Container>
                <Row>
                    <div className='p-2'>

                        <Form.Group>
                    
                            <Form.Label>I have done more: ({completedHours} of {goalAvailableHours} h)
                            </Form.Label>
                            <Form.Control type="range" min={30} max={goalAvailableMinutes} step={30}                                          
                                value={newCompleteMinutes}
                                onChange={e => {
                                    setNewCompleteMinutes(parseInt(e.target.value));
                                }}/>
                        </Form.Group>
                        
                        <Button variant="light" size="sm">
                            <FontAwesomeIcon icon={faPlusCircle} color={"#44aa77"}/> Record hours
                        </Button>
                    </div>
                    <div className='p-2'>
                        
                        <Button variant="light" size="sm"

                            onClick={(e: any) => {
                                setLocalTaskView(true)
                            }}
                        
                        >
                            <FontAwesomeIcon icon={faList} color={"#888888"}/> {plannedTaskHourMessage}
    
                        </Button>
                    </div>
    
                </Row>
    
            </Container>

        ) 
    }
    
    function getTaskComponent(goal: any) {
        let tasks:[] = goal.tasks;

        if (!tasks) {return}

        let taskViews = [];
        if (!tasks) {
            return <></>;
        }
        

        for (let task of tasks) {
            taskViews.push(getTaskView(task));
        }

        return (
            <div ref={taskListRef}>
            
                <div className='d-flex p-2'>
                        
                    <Button variant="light" size="sm"

                        onClick={(e: any) => {
                            setLocalTaskView(false);
                            // taskListRef.current?.set
                            
                        }}
                    
                    >
                    <FontAwesomeIcon icon={faList} color={"#ff8888"}/> Hide Tasks

                    </Button>
                </div>
                <div>
                    {taskViews}

                </div>
                <div className='d-flex p-2'>
                        
                    <Button variant="light" size="sm"

                        onClick={(e: any) => {
                            setLocalTaskView(false);
                            // taskListRef.current?.set
                            
                        }}
                    
                    >
                    <FontAwesomeIcon icon={faList} color={"#ff8888"}/> Hide Tasks

                    </Button>
                </div>
            </div>);

    }
    
    function getTaskView(task: any) {
        return (
            
            <Card className='task-card' id={`task-${task.taskNo}`}>
                <Card.Body>
                    <Badge className='float-right'>--</Badge>
                    <div>{task.title}</div>
                </Card.Body>
            </Card>
        );
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