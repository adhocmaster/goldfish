import axios from 'axios';
import ResponseProcessor from 'framework/ResponseProcessor';
import actionManager from 'framework/ActionManager';
import config from 'framework/Configuration';
import { ActionType } from 'app/actionTypes';
import { WeekActionType } from 'features/week/week.actions';
import { RootState } from 'app/store';
import toastService from 'app/toast.service';
import { useSelector, shallowEqual } from 'react-redux';
import deepEqual from 'deep-equal';
import yearService from 'features/year/year.service';
import Utility from 'framework/Utility';

class WeekService {

    cache: Map<string, any> = new Map();
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
            actionManager.dispatch(WeekActionType.WEEK_ERROR, errors, true);
        });
    }


    public getFromStore() {
        return useSelector((state:RootState) => {return state.weekState.weekDetails}, deepEqual);
    }


    public getById(weekId: string, useCache = false) {

        if (useCache && this.cache.get(weekId)) {
            
            const week = this.cache.get(weekId);
            actionManager.dispatch(WeekActionType.WEEK_FETCHED, week, false);
            return;

        }

        axios.get(
            this.serviceUrl + '/' + weekId

        ).then( (result) => {

            
            const errors = ResponseProcessor.getError(result.data);

            if ( errors.length == 0 ) {

                console.log("got week");
                let data = result.data;
                
                if (useCache) {
                    this.cache.set(weekId, data);
                }
                actionManager.dispatch(WeekActionType.WEEK_FETCHED, data, false);


            } else {

                actionManager.dispatch(WeekActionType.WEEK_ERROR, errors, true);
                toastService.error(errors);

            }

        }).catch((error) => {
            
            const errors = ResponseProcessor.getHTTPError(error);
            // console.log(errors);
            actionManager.dispatch(WeekActionType.WEEK_ERROR, errors, true);
            toastService.error(errors);
        });

    }
    public getByStartDate(startDate: Date) {

    }
    public getClosestWeek() {

    }

    public getWeekOfTheYear(weekDetails: any) {

        //  TODO: getWeekOfTheYear fix this, optimize this.

        if (!weekDetails) {
            return undefined;
        }

        let date = weekDetails.dateStart;
        if (typeof(date) === "string") {
            date = new Date(date);
        }


        let weeks = yearService.getWeekDates(date.getFullYear());

        for (let index in weeks) {
            let weekStart = weeks[index].start;
            if (
                weekStart.getDate() == date.getDate() 
                &&  weekStart.getMonth() == date.getMonth() 
                && weekStart.getFullYear() == date.getFullYear()
                ){
                return index;
            }
        }

        return 53; 
    }

    public getLocalStartDateString(weekDetails: any){
        
        if (!weekDetails) {
            return undefined;
        }
        let date = weekDetails.dateStart;
        if (typeof(date) === "string") {
            date = new Date(date);
        }
        return date.toLocaleDateString();

    }

    public addGoal(weekDetails: any, goal: any) {

        // 1. check hours
        if( !this.hasEnoughTimeForGoal(weekDetails, goal) ) {
            throw new Error(`You have ${this.getAvailableHours(weekDetails)}, but your attempted to allocate ${Utility.hoursFromMinutes( goal.totalMinutes )}`)
        }



        const existingGoals = weekDetails.categorizedTasks;
        
        const updatedGoals = [...existingGoals, goal];

        const clonedWeek = {...weekDetails, categorizedTasks: updatedGoals};

        this.update(clonedWeek);

    }

    public update(weekDetails: any) {
        
        const weekId = weekDetails.id;

        axios.patch(

            this.serviceUrl + '/' + weekId, 
            weekDetails

        ).then( (result) => {

            
            const errors = ResponseProcessor.getError(result.data);

            if ( errors.length == 0 ) {

                console.log("got week");
                let data = result.data;
                console.log(data);
                // actionManager.dispatch(WeekActionType.WEEK_FETCHED, data, false);
                actionManager.dispatch(WeekActionType.GOAL_ADDED_TO_WEEK, data);


            } else {

                actionManager.dispatch(WeekActionType.WEEK_ERROR, errors, true);
                toastService.error(errors);

            }

        }).catch((error) => {
            
            const errors = ResponseProcessor.getHTTPError(error);
            actionManager.dispatch(WeekActionType.WEEK_ERROR, errors, true);
            toastService.error(errors);
        });


    }

    public hasEnoughTimeForGoal(weekDetails: any, goal: any) {

        if (this.getAvaiableMinutes(weekDetails) >= goal.totalMinutes) {
            return true;
        }

        return false;

    }

    public getAvailableHours(weekDetails: any) {
        let minutes = this.getAvaiableMinutes(weekDetails);
        return Utility.hoursFromMinutes(minutes);
    }

    public getAvaiableMinutes(weekDetails: any) {

        // console.log("type of total minutes" + typeof weekDetails.totalMinutes);
        const availableMinutes =  weekDetails.totalMinutes - weekDetails.plannedMinutes;
        // console.log("available minutes " + availableMinutes);
        return availableMinutes;
    }

}


const weekService = new WeekService();
export default weekService;
