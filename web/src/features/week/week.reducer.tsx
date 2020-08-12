
import actionManager from 'framework/ActionManager';
import { WeekActionType } from 'features/week/week.actions';
import toastService from 'app/toast.service';

export default function WeekReducer(state: any, action: any) {

    if( state === undefined) {
        state = { 
            weekDetails: {

                id: null,
                name: "Week 1",
                dateStart: "1000-11-11",
                days: 7

            }
        };
    }

    console.log(action.type);


    let week:any = {};
    switch(action.type) {

        case WeekActionType.WEEK_FETCHED:
            week = action.payload;
            // if( state.weekDetails ) {
            //     week = {...state.weekDetails, ...week};
            // }asd

            state = {...state, weekDetails: week}
            break;
        case WeekActionType.WEEK_ERROR:
            break;
        case WeekActionType.GOAL_ADDED_TO_WEEK:
            // console.log('GOAL_ADDED_TO_WEEK')
            week = action.payload;
            state = {...state, weekDetails: week, showGoalModal: false};
            break;
        case WeekActionType.SHOW_GOAL_FORM: 

            // console.log('SHOW_GOAL_FORM')
            state = {...state, showGoalModal: true};
            break;
        
        case  WeekActionType.HIDE_GOAL_FORM:
            state = {...state, showGoalModal: false};
            break;
        


    }

    return state;

}
