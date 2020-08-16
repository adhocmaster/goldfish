import { faList, faPlusCircle, faMinusSquare, faEllipsisH, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import toastService from 'app/toast.service';
import deepEqual from 'deep-equal';
import Utility from 'framework/Utility';
import React, { createRef, useEffect, useState } from 'react';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { shallowEqual, useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import goalService from './goal.service';
import TaskComponent from './task.component';
import Dropdown from 'react-bootstrap/Dropdown';




export default function GoalComponent(props: any): any {

    console.log(props.goal.categoryId + " GoalComponent: enterred");
    // console.log(props);
    const minMinutes = 30;
    const goalStatesFromStore: any = useSelector<any>((state:RootState) => { return state.weekState.goalStates}, deepEqual);
    const weekDetailsFromStore: any = useSelector<any>((state:RootState) => { return state.weekState.weekDetails}, deepEqual);
    const weekIdFromStore: any = useSelector<any>((state:RootState) => {  return state.weekState.weekId }, shallowEqual);
    const taskViewFromStore: any = useSelector<any>((state:RootState) => {  return state.weekState.taskView }, shallowEqual);
    const [goal, setGoal] = useState<any>(props.goal);
    const [weekId, setWeekId] = useState<any>({});
    const [isTaskView, setTaskView] = useState<boolean>(false);
    const [isLocalTaskView, setLocalTaskView] = useState<boolean| undefined>(undefined);
    const [recordMinutes, setRecordMinutes] = useState(0);

    console.log(goal.categoryId + " GoalComponent: recordMinutes" + recordMinutes);

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

        let goalAvailableMinutes = goalService.getGoalAvailableMinutes(goal);
        if (!goalAvailableMinutes) goalAvailableMinutes = 0;
        let goalAvailableHours = Utility.hoursFromMinutes(goalAvailableMinutes);
        let goalTotalHours = Utility.hoursFromMinutes(goal.totalHours);
        let completedHours = Utility.hoursFromMinutes(goal.completedMinutes + recordMinutes);

        let plannedTaskHourMessage = <span>No planned tasks.</span>;
        if (goal.plannedMinutes && goal.plannedMinutes != 0) {
            plannedTaskHourMessage = <span><b>{Utility.hoursFromMinutes(goal.plannedMinutes)} h</b> planned in tasks.</span>;
        }

        return (
            <div>
                <div className='p-2'>

                    <Form.Group>
                
                        <Form.Label>I have done more:
                        </Form.Label>
                        <Form.Control type="range" min={0} max={goalAvailableMinutes} step={minMinutes}                                         
                            value={recordMinutes}
                            onChange={e => {
                                let newMinutes = parseInt(e.target.value);
                                console.log(newMinutes);
                                setRecordMinutes(newMinutes);
                            }}/>
                    </Form.Group>
                    
                    <Button variant="light" size="sm"

                        onClick={(e: any) => {
                            try {
                                setRecordMinutes(0);
                                goalService.recordHours(weekDetailsFromStore, goal, recordMinutes);
                            } catch (error) {
                                toastService.error(error.message);
                            }
                        }}
                    >
                        <FontAwesomeIcon icon={faPlusCircle} color={"#44aa77"}/> Record hours (<b>{Utility.hoursFromMinutes(recordMinutes)}</b>/{goalAvailableHours} h)
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
    
            </div>

        ) 
    }
    
    function getTaskComponent(goal: any) {
        let tasks:[] = goal.tasks;

        if (!tasks) {tasks = []}

        let taskViews = [];
        if (!tasks) {
            return <></>;
        }
        

        let taskIndex = 0;
        for (let task of tasks) {
            taskViews.push(getTaskView(task, taskIndex));
            ++taskIndex;
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
            </div>);

    }
    
    function getTaskView(task: any, taskIndex: number) {

        if (task.isDummy) {
            return getDummyTaskCard(task, taskIndex);
        }

        return getTaskCard(task, taskIndex);

    }


    function getDummyTaskCard(task: any, taskIndex: number) {
        
        const title = <em>Unplanned goal hours</em>;
        return (

            <Card className='task-card' id={`task-${taskIndex}`}>
                <Card.Body>
                    <Button variant="light"  size='sm'  className='float-right'
                        onClick={(e: any) => {
                            toastService.message("Task to be deleted");
                            removeTask(taskIndex);
                        }}
                    > <FontAwesomeIcon icon={faMinusSquare} color={"#ff8888"} />
                    </Button>
                    <div onClick={(e: any) => {toastService.message("Editing task is coming soon.")}}>{title}</div>
                </Card.Body>
            </Card>
        )
    }


    function getTaskCard(task: any, taskIndex: number) {
        
        const title = task.title;
        return (

            <Card className='task-card' id={`task-${taskIndex}`}>
                <Card.Body>
                    <Button variant="light"  size='sm'  className='float-right'
                        onClick={(e: any) => {
                            toastService.message("Task options");
                            // removeTask(taskIndex);
                        }}
                    > 
                        <FontAwesomeIcon icon={faEllipsisV} color={"#ff8888"} />
                    </Button>
                    {/* <Dropdown>
                        <Dropdown.Toggle variant="light" id="dropdown-basic">
                            <FontAwesomeIcon icon={faEllipsisV} color={"#ff8888"} />
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                            <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                            <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown> */}
                    <div onClick={(e: any) => {toastService.message("Editing task is coming soon.")}}>{title}</div>
                </Card.Body>
            </Card>
        )
    }

    function removeTask(index: number) {

        goalService.removeTaskById(weekDetailsFromStore, goal, index);
    }


    function getNewTaskForm(weekId: string, goal: any) {


        // if(!weekDetails || !categoryId) return;
        // console.log(weekDetails);
        return (
            <TaskComponent weekDetails={weekDetailsFromStore} goal={goal} />
        );
    }

}