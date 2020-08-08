
import actionManager from 'framework/ActionManager';
import { WeekActionType } from 'features/week/week.actions';

export default function WeekReducer(state: any, action: any) {

    if( state === undefined) {
        state = { 
            id: null,
            name: "Week 1",
            dateStart: '06/21/2020',
            days: 0
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

    return state;

}
