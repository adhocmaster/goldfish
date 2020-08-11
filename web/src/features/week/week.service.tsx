import axios from 'axios';
import ResponseProcessor from 'framework/ResponseProcessor';
import actionManager from 'framework/ActionManager';
import config from 'framework/Configuration';
import { ActionType } from 'app/actionTypes';
import { WeekActionType } from 'features/week/week.actions';
import { RootState } from 'app/store';
import toastService from 'app/toast.service';

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
    public getById(weekId: string) {

        axios.get(
            this.serviceUrl + '/' + weekId

        ).then( (result) => {

            
            const errors = ResponseProcessor.getError(result.data);

            if ( errors.length == 0 ) {

                console.log("got week");
                let data = result.data;
                actionManager.dispatch(WeekActionType.WEEK_FETCHED, {data}, false);


            } else {

                actionManager.dispatch(WeekActionType.WEEK_ERROR, errors, true);
                toastService.error(errors);

            }

        }).catch((error) => {
            
            const errors = ResponseProcessor.getHTTPError(error);
            console.log(errors);
            actionManager.dispatch(WeekActionType.WEEK_ERROR, errors, true);
            toastService.error(errors);
        });

    }
    public getByStartDate(startDate: Date) {

    }
    public getClosestWeek() {

    }

}


const weekService = new WeekService();
export default weekService;
