import axios from 'axios';
import ResponseProcessor from 'framework/ResponseProcessor';
import actionManager from 'framework/ActionManager';
import config from 'framework/Configuration';
import { ActionType } from 'app/actionTypes';
import { RootState } from 'app/store';

class YearService {

    public create(year: string) {

        // axios.post(
            
        //     config.getBackend(),
        //     {
                
        //     }

        // );
    }

    public getWeekDates(year: number) {

        console.log("getting weeks for " + year);
        let startDate: Date = new Date(year + "-01-03");  
        startDate.setDate(1);
        startDate.setHours(0, 0, 0);
        let endDate = new Date(year + "-01-07");
        endDate.setDate(7);
        endDate.setHours(23, 59, 59);
        let increment = 7;

        let weeks: any= {};

        for (let i = 1; i < 53; ++i) {
            
            // console.log("startDate toISOString() = " + startDate.toISOString());
            // console.log("endDate toISOString() = " + endDate.toISOString());
            // console.log("startDate toString() = " + startDate.toString());
            // console.log("endDate toString() = " + endDate.toString());
            weeks[i] = {
                'start': new Date(startDate),
                'end': new Date(endDate)
            }
            startDate.setDate(startDate.getDate() + increment)
            endDate.setDate(endDate.getDate() + increment)
        }

        return weeks;

    }


}

const yearService = new YearService();
export default yearService;
