
import actionManager from 'framework/ActionManager';
import { WeekActionType } from 'features/week/week.actions';
import toastService from 'app/toast.service';
import _ from 'lodash'


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
    let goalStates: any = {};
    switch(action.type) {

        case WeekActionType.WEEK_FETCHED:
            week = action.payload;
            
            goalStates = createGoalStatesFromArr(week.categorizedTasks);

            state = {
                ...state, 
                weekDetails: getWeekDetails(week),
                ...goalStates
            }

            break;

        case WeekActionType.WEEK_ERROR:
            // toastService.error(action.payload);
            // whether toast will be used is left for desicion to services.
            break;

        case WeekActionType.GOAL_ADDED_TO_WEEK:
        case WeekActionType.GOAL_UPDATED_OF_WEEK:

            // When a goal is added to week, some properties to the week changes. So, we need to change weekDetails
            week = action.payload;
            goalStates = createGoalStatesFromArr(week.categorizedTasks);
            state = {
                ...state, 
                weekDetails: getWeekDetails(week),
                ...goalStates,
                showGoalModal: false
            }

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

    function getWeekDetails(week: any) {
        return _.omit(week, ['categorizedTasks']);
    }


    function createGoalStatesFromArr(goals: any[]) {

        if(!goals) { return {}; }

        let goalStates = {};

        for (let goal of goals) {
            let goalId = goal.categoryId;
            goalStates = {...goalStates, goalId: goal};
        }

        return goalStates;

    }
    
    function createGoalState(goal: any) {

        let goalId = goal.categoryId;
        return { goalId: goal };

    }
}
