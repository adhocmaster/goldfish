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

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusSquare, faPlusCircle, faList } from '@fortawesome/free-solid-svg-icons';
import GoalComponent from './goal.component';


export default function GoalComponents(props: any): any {

    console.log("GoalComponents: enterred");
    console.log(props);
    const [goals, setGoals] = useState<any>({});
    const [weekId, setWeekId] = useState<any>({});
    const [isTaskView, setTaskView] = useState(false);

    const goalStatesFromStore: any = useSelector<any>((state:RootState) => { return state.weekState.goalStates}, deepEqual);
    const weekDetailsFromStore: any = useSelector<any>((state:RootState) => { return state.weekState.weekDetails}, deepEqual);
    const weekIdFromStore: any = useSelector<any>((state:RootState) => {  return state.weekState.weekId }, shallowEqual);
    
    console.log("GoalComponents: goalStatesFromStore");
    console.log(goalStatesFromStore);
    useEffect(() => {
        console.log("GoalComponents: useEffect");
        // if( !deepEqual(goals, goalStatesFromStore)) {
        //     console.log('calling setGoals');
        //     setGoals(goalStatesFromStore);
        // }

        // if ( weekId != weekIdFromStore ) {
        //     console.log('calling setWeekId');
        //     setWeekId(weekIdFromStore);
        // }

        if (!isTaskView && props.taskView == "checked" ) {
            setTaskView(true);
        } else if (isTaskView && props.taskView == "unchecked" ) {
            setTaskView(false);
        }
    
    });

    let cards = [];
    let goal: any;


    for (goal of Object.values(goalStatesFromStore)) {
        
        const progress = Utility.hoursFromMinutes(goal.completedMinutes / goal.totalMinutes);
        cards.push(<GoalComponent goal={goal} />)
    }

    console.log("GoalComponents: rendering");
    return cards;

}