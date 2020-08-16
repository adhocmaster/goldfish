
import actionManager from 'framework/ActionManager';
import { WeekActionType } from 'features/week/week.actions';
import toastService from 'app/toast.service';
import _ from 'lodash'
import goalService from 'features/goal/goal.service';


export default function WeekReducer(state: any, action: any) {

    

    if( state === undefined) {
        state = { 
            weekId: null,
            weekDetails: {

                id: null,
                name: "Week 1",
                dateStart: "1000-11-11",
                days: 7

            },
            goalStates: {},
            taskView: false
        };
    }

    console.log(action.type);


    let week:any = {};
    let goalStates: any = {};
    switch(action.type) {

        case WeekActionType.WEEK_FETCHED:
            week = action.payload;
            reCalculateTImes(week);
            
            goalStates = createGoalStatesFromArr(week.categorizedTasks);

            state = {
                ...state,
                weekId: week.id, 
                weekDetails: getWeekDetails(week),
                goalStates: goalStates,
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
            reCalculateTImes(week);
            goalStates = createGoalStatesFromArr(week.categorizedTasks);
            state = {
                ...state, 
                weekId: week.id, 
                weekDetails: getWeekDetails(week),
                goalStates: goalStates,
                showGoalModal: false
            }

            break;

        case WeekActionType.GOAL_REMOVED_FROM_WEEK:

            // When a goal is added to week, some properties to the week changes. So, we need to change weekDetails
            week = action.payload;
            reCalculateTImes(week);
            goalStates = createGoalStatesFromArr(week.categorizedTasks);
            state = {
                ...state, 
                weekId: week.id, 
                weekDetails: getWeekDetails(week),
                goalStates: goalStates,
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
            
        
        case  WeekActionType.SET_TASK_VIEW:
            
            // console.log("WeekReducer: taskView dispatched: " + action.payload.taskView);
            state = {...state, taskView: action.payload.taskView};
            break;

    }

    return state;

    function getWeekDetails(week: any) {
        // return _.omit(week, ['categorizedTasks']);
        return week;
    }


    function createGoalStatesFromArr(goals: any[]) {

        if(!goals) { return {}; }

        let goalStates = {};

        for (let goal of goals) {
            goalStates = {...goalStates, ...createGoalState(goal)};
        }

        return goalStates;

    }
    
    function createGoalState(goal: any) {

        let goalId = goal.categoryId;
        let obj: { [key: string]: any } = {}
        obj[goalId] = goal;

        return obj;

    }

    
    function reCalculateTImes(week: any) {

        if (!week.categorizedTasks) {
            return;
        }

        let plannedMinutes = 0;
        let completedMinutes = 0;

        let catIndex: number;
        for (catIndex = 0; catIndex < week.categorizedTasks?.length; ++catIndex) {

            let catTasks = week.categorizedTasks[catIndex];
            goalService.reCalculateGoalTimes(catTasks);
            plannedMinutes += catTasks.totalMinutes ?? 0;
            completedMinutes += catTasks.completedMinutes ?? 0;

        }

        week.plannedMinutes = plannedMinutes;
        week.completedMinutes = completedMinutes;

    }
}
