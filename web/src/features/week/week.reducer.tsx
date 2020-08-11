
import actionManager from 'framework/ActionManager';
import { WeekActionType } from 'features/week/week.actions';
import toastService from 'app/toast.service';

export default function WeekReducer(state: any, action: any) {

    if( state === undefined) {
        state = { 
            id: null,
            name: "Week 1",
            dateStart: "2020-11-11",
            days: 7
        };
    }

    if(action.type === WeekActionType.SHOW_GOAL_FORM) {

        console.log('SHOW_GOAL_FORM')
        state = {...state, showGoalModal: true};

    }

    if(action.type === WeekActionType.HIDE_GOAL_FORM) {

        state = {...state, showGoalModal: false};

    }
    if(action.type === WeekActionType.GOAL_ADDED) {

        console.log('GOAL_ADDED')
        //  TODO update the category lists.

        //  then hide the goal modal
        state = {...state, showGoalModal: false};

    }

    switch(action.type) {

        case WeekActionType.WEEK_FETCHED:
            let week = action.payload;
            state = {...state, weekDetails: week}
            break;
        case WeekActionType.WEEK_ERROR:
            break;

    }

    return state;

}
