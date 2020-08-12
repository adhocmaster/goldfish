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
import GoalService from './goal.service';
import goalService from './goal.service';
import Utility from 'framework/Utility';
import toastService from 'app/toast.service';


export default function GoalModal(props: any): any {

    
    const goalId = useSelector((state: RootState) => { return state.taskState.id });
    const titleFromStore = useSelector((state: RootState) => { return state.taskState.title });
    const totalMinutesFromStore = useSelector((state: RootState) => { return state.taskState.totalMinutes });

    const [weekDetails, setWeekDetails] = useState({});
    const [title, setTitle] = useState<string>(titleFromStore);
    const [totalMinutes, setTotalMinutes] = useState<number>(totalMinutesFromStore);
    const [totalHours, setTotalHours] = useState<number>(0);

    
    useEffect(() => {

        setWeekDetails(props.weekDetails);
        console.log(weekDetails);

        setAvailableMinutes(weekService.getAvaiableMinutes(weekDetails));
        setAvailableHours(weekService.getAvailableHours(weekDetails));

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

    return (
        <>
            <Form.Group>
                <Form.Control as="textarea" rows={1} placeholder='Type title of the task'> 

                </Form.Control>
                <Form.Control type="range" min={30} max={availableMinutes} step={30}                                          
                    value={totalMinutes}
                    onChange={e => {
                        setTotalMinutes(parseInt(e.target.value));
                        setTotalHours(Utility.hoursFromMinutes(totalMinutes));
                }}/>
            </Form.Group>
            
            <Button variant='secondary' size='sm' onClick={(e: any) => { e.preventDefault(); addTask(categoryId); }}>
                + ADD
            </Button>
        </>
    );
}