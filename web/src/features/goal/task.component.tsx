import toastService from 'app/toast.service';
import deepEqual from 'deep-equal';
import Utility from 'framework/Utility';
import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import goalService from './goal.service';



export default function TaskComponent(props: any): any {

    
    const minMinutes = 30;
    const taskNo = useSelector((state: RootState) => { return state.taskState.taskNo });
    const titleFromStore = useSelector((state: RootState) => { return state.taskState.title });
    const totalMinutesFromStore = useSelector((state: RootState) => { return state.taskState.totalMinutes });

    // const [weekDetails, setWeekDetails] = useState({});
    // const [goalId, setGoalId] = useState("");
    const [title, setTitle] = useState<string>("");
    const [totalMinutes, setTotalMinutes] = useState<number>(0);
    const [availableMinutes, setAvailableMinutes] = useState<number>(0);

    const weekDetails = props.weekDetails;
    // const goal = weekService.getGoal(props.weekDetails, props.goalId);
    const goal = props.goal;
    const goalId = goal.categoryId;

    
    useEffect(() => {

        const goalAvailableMinutes = goalService.getAvaiableMinutes(goal);
        // console.log(`Task component: goalAvailableMinutes: ${goal.title} ` + goalAvailableMinutes);
        // console.log(`Task component: availableMinutes: ${goal.title} ` + availableMinutes);
        // console.log(`Task component: availableHours: ${goal.title} ` + availableHours);
        if (!deepEqual(availableMinutes, goalAvailableMinutes)) {

            setAvailableMinutes(goalService.getAvaiableMinutes(goal));
        }

    });

    function addTask() {

        console.log("adding task to " + goalId);
        let task = {
            title: title,
            totalMinutes: totalMinutes
        }
        try {

            goalService.addTask(weekDetails, goal, task);
        } catch (error) {
            toastService.error(error.message);
        }

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
                
                <Form.Label>Allocate: ({Utility.hoursFromMinutes(totalMinutes)} of {Utility.hoursFromMinutes(availableMinutes)} h)</Form.Label>
                <Form.Control type="range" min={0} max={availableMinutes} step={minMinutes}                                          
                    value={totalMinutes}
                    onChange={e => {
                        setTotalMinutes(parseInt(e.target.value));
                    }}/>
            </Form.Group>
            
            <Button variant='secondary' size='sm' onClick={(e: any) => { e.preventDefault(); addTask(); }}>
                + ADD
            </Button>
        </>
    );
}