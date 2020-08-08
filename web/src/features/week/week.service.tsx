import axios from 'axios';
import ResponseProcessor from 'framework/ResponseProcessor';
import actionManager from 'framework/ActionManager';
import config from 'framework/Configuration';
import { ActionType } from 'app/actionTypes';
import { WeekActionType } from 'features/week/week.actions';
import { RootState } from 'app/store';

class WeekService {

    serviceUrl = config.getBackend() + "/weeks";

    public create(goal: string, start?: Date, days?: number) {

        axios.post(
            this.serviceUrl,
            {
                "goal": goal,
                "start": start ?? new Date().toISOString(),
                "days": days ?? 7
            }

        ).then( (result) => {

        }).catch((error) => {
            
            const errors = ResponseProcessor.getHTTPError(error);
            actionManager.dispatch(ActionType.LOGIN_FAILED, errors, true);
        });
    }

    public createGoal(props: any) {

        actionManager.dispatch(WeekActionType.GOAL_ADDED);
    }

}


const weekService = new WeekService();
export default weekService;
