import axios from 'axios';
import config from "framework/Configuration";
import ResponseProcessor from 'framework/ResponseProcessor';
import { WeekActionType } from 'features/week/week.actions';
import actionManager from 'framework/ActionManager';
import toastService from 'app/toast.service';

class GoalService {

    serviceUrl = config.getBackend() + "/categories";
    public create(newGoal: any) {

        axios.post(
            this.serviceUrl,
            newGoal

        ).then( (result) => {
            
            const errors = ResponseProcessor.getError(result.data);

            if ( errors.length == 0 ) {

                console.log("got goal");
                let data = result.data;
                // console.log(data);
                actionManager.dispatch(WeekActionType.NEW_GOAL_ADDED, data, false);


            } else {

                actionManager.dispatch(WeekActionType.GOAL_ERROR, errors, true);
                toastService.error(errors);

            }

        }).catch((error) => {
            
            const errors = ResponseProcessor.getHTTPError(error);
            actionManager.dispatch(WeekActionType.GOAL_ERROR, errors, true);
        });

    }
}

export default new GoalService();