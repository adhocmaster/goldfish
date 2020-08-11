import { WeekActionType } from "features/week/week.actions";

export default function GoalReducer(state: any, action: any) {

    if( state === undefined) {
        state = { 

            categoryId: "",
            title: "",
            plannedMinutes: 0

        };
    }

    if(action.type === WeekActionType.NEW_GOAL_ADDED) {
        
        state = {...state, ...action.payload};

    }

    return state;

}
