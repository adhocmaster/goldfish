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
import actionManager from 'framework/ActionManager';
import { WeekActionType } from 'features/week/week.actions';
import weekService from 'features/week/week.service';
import goalService from './goal.service';
import Utility from 'framework/Utility';
import toastService from 'app/toast.service';
import deepEqual from 'deep-equal';


export default function TaskComponent(props: any): any {

    
    const taskNo = useSelector((state: RootState) => { return state.taskState.taskNo });
    const titleFromStore = useSelector((state: RootState) => { return state.taskState.title });
    const totalMinutesFromStore = useSelector((state: RootState) => { return state.taskState.totalMinutes });

    // const [weekDetails, setWeekDetails] = useState({});
    // const [goalId, setGoalId] = useState("");
    const [title, setTitle] = useState<string>("");
    const [totalMinutes, setTotalMinutes] = useState<number>(0);
    const [totalHours, setTotalHours] = useState<number>(0);
    const [availableMinutes, setAvailableMinutes] = useState<number>(0);
    const [availableHours, setAvailableHours] = useState<number>(0);

    const weekDetails = props.weekDetails;
    // const goal = weekService.getGoal(props.weekDetails, props.goalId);
    const goal = props.goal;
    const goalId = goal.categoryId;

    
    useEffect(() => {

        // console.log(props);
        // setWeekDetails(props.weekDetails);
        // setGoalId(props.goalId);
        // console.log(props.weekDetails);
        // const goal = weekService.getGoal(props.weekDetails, props.goalId);
        // console.log(goal);
        const goalAvailableMinutes = goalService.getAvaiableMinutes(goal);
        if (!deepEqual(availableMinutes, goalAvailableMinutes)) {

            setAvailableMinutes(goalService.getAvaiableMinutes(goal));
            setAvailableHours(Utility.hoursFromMinutes(availableMinutes));
        }

    });

    function addTask() {

        console.log("adding task to " + goalId);
        let task = {
            title: title,
            totalMinutes: totalMinutes
        }
        weekService.addTask(weekDetails, goal, task);

    }


    if (!weekDetails) {
        return(
            <Spinner animation="grow" />
        )
    }
    return (
        <>
            <Form.Group>
                <Form.Control as="textarea" rows={1} placeholder='Type title of the task'                                 
                    value={title}
                    onChange={e => {
                        setTitle(e.target.value);
                    }}/>
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
            
            <Button variant='secondary' size='sm' onClick={(e: any) => { e.preventDefault(); addTask(); }}>
                + ADD
            </Button>
        </>
    );
}