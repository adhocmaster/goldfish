import { WeekActionType } from "features/week/week.actions";
import { Console } from "console";

export default function GoalReducer(state: any, action: any) {

    if( state === undefined) {
        state = { 

            id: "",
            title: "",
            totalMinutes: 0

        };
    }

    if(action.type === WeekActionType.NEW_GOAL_ADDED) {
        
        console.log("Handling NEW_GOAL_ADDED in goal reducer");
        action.payload.isNewGoalCreated = true;
        state = {...state, ...action.payload};
        console.log(state);

    }

    return state;

}
