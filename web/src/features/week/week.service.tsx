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
import goalService from 'features/goal/goal.service';

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

        // if (useCache && this.cache.get(weekId)) {
            
        //     const week = this.cache.get(weekId);
        //     actionManager.dispatch(WeekActionType.WEEK_FETCHED, week);
        //     return;

        // }

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

    public addTask(weekDetails: any, goal: any, task: any) {


        const goalId = goal.categoryId;

        console.log(`adding task ${task} to ${goalId}`);
        // 1. check hours
        if( !goalService.hasEnoughTimeFoTask(goal, task) ) {
            throw new Error(`You have ${goalService.getAvailableHours(goal)}, but your attempted to allocate ${Utility.hoursFromMinutes( task.totalMinutes )}`)
        }

        let updatedTasks = [task];
        if (goal.tasks) {
            updatedTasks = [...goal.tasks, task];
        }
        const clonedGoal = {...goal, tasks: updatedTasks};

        this.reCalculateGoalTimes(clonedGoal);

        this.updateGoalOfWeek(weekDetails, clonedGoal, clonedGoal);

    }
    
    public reCalculateGoalTimes(goal: any) {

        
        if(!goal.tasks) {
            return;
        }

        let plannedMinutes = 0;
        let completedMinutes = 0;

        let taskIndex: number;
        for (taskIndex = 0; taskIndex < goal.tasks?.length; ++taskIndex) {

            let task = goal.tasks[taskIndex];
            plannedMinutes += task.totalMinutes ?? 0;
            completedMinutes += task.completedMinutes ?? 0;

        }

        goal.plannedMinutes = plannedMinutes;
        goal.completedMinutes = completedMinutes;

    }

    public addGoalToWeek(weekDetails: any, goal: any) {

        // 1. check already existing

        if (this.goalAlreadyExists(weekDetails, goal)) {
            
            throw new Error(`Goal already exists.`);

        }
        // 2. check hours
        if( !this.hasEnoughTimeForGoal(weekDetails, goal) ) {
            throw new Error(`You have ${this.getAvailableHours(weekDetails)}, but your attempted to allocate ${Utility.hoursFromMinutes( goal.totalMinutes )}`);
        }

        axios.post(

            this.serviceUrl + '/category/' + weekDetails.id, 
            goal

        ).then( (result) => {

            
            const errors = ResponseProcessor.getError(result.data);

            if ( errors.length == 0 ) {

                console.log("update: got week after adding goal.");
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

    public goalAlreadyExists(weekDetails: any, goal: any) {

        if (!weekDetails.categorizedTasks) {
            return false;
        }

        for (let existingCat  of weekDetails.categorizedTasks) {

            if (existingCat.categoryId ==  goal.categoryId) {
                return true;
            }
            
        }

        return false;

    }

    public updateGoalOfWeek(weekDetails: any, goal: any, oldGoal: any) {

        // 1. check already existing

        if (!this.goalAlreadyExists(weekDetails, goal)) {
            
            throw new Error(`Goal doesn't exist.`);

        }

        let availableMinutes = weekDetails.totalMinutes - weekDetails.plannedMinutes + oldGoal.totalMinutes;

        // 2. check hours
        if( availableMinutes < goal.totalMinutes ) {

            throw new Error(`You have ${Utility.hoursFromMinutes(availableMinutes)}h available, but your attempted to allocate ${Utility.hoursFromMinutes( goal.totalMinutes )}h`);
        }

        
        axios.patch(

            this.serviceUrl + '/category/' + weekDetails.id, 
            goal

        ).then( (result) => {

            
            const errors = ResponseProcessor.getError(result.data);

            if ( errors.length == 0 ) {

                console.log("update: got week after adding goal.");
                let data = result.data;
                console.log(data);
                // actionManager.dispatch(WeekActionType.WEEK_FETCHED, data, false);
                actionManager.dispatch(WeekActionType.GOAL_UPDATED_OF_WEEK, data);


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



    public getGoalsWithoutId(goals: any, goalId: string) {

        let newArr: any[] = [];

        if(!goals) {
            return newArr;
        }

        for (let goal of goals) {
            if (goal.categoryId != goalId) {
                newArr.push(goal);
            }
        }

        return newArr;

    }
    
    public getTotalMinutesOfGoals(goals: any[]) {

        let total = 0;

        if(!goals) { return total; }

        for (let goal of goals) {
            total += goal.totalMinutes;
        }

        return total;
    }

    public getPlannedMinutesOfGoals(goals: any[]) {

        let total = 0;

        if(!goals) { return total; }

        for (let goal of goals) {
            total += goal.plannedMinutes;
        }

        return total;
    }

    public getCompletedMinutesOfGoals(goals: any[]) {

        let total = 0;

        if(!goals) { return total; }

        for (let goal of goals) {
            total += goal.completedMinutes;
        }

        return total;
    }

    // public addGoal2(weekDetails: any, goal: any) {

    //     // 1. check hours
    //     if( !this.hasEnoughTimeForGoal(weekDetails, goal) ) {
    //         throw new Error(`You have ${this.getAvailableHours(weekDetails)}, but your attempted to allocate ${Utility.hoursFromMinutes( goal.totalMinutes )}`)
    //     }

    //     const existingGoals = weekDetails.categorizedTasks;
        
    //     const updatedGoals = [...this.getGoalsWithoutId(existingGoals, goal.categoryId), goal];

    //     const clonedWeek = {...weekDetails, categorizedTasks: updatedGoals};

    //     this.update(clonedWeek);

    // }
    

    public update(weekDetails: any) {
        
        const weekId = weekDetails.id;

        axios.patch(

            this.serviceUrl + '/' + weekId, 
            weekDetails

        ).then( (result) => {

            
            const errors = ResponseProcessor.getError(result.data);

            if ( errors.length == 0 ) {

                console.log("update: got week");
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

        
        let otherGoals = this.getGoalsWithoutId(weekDetails.categorizedTasks, goal.id);
        let otherGoalsTotalMinutes = this.getTotalMinutesOfGoals(otherGoals);

        if (weekDetails.totalMinutes >= goal.totalMinutes + otherGoalsTotalMinutes) {
            return true;
        }

        return false;

    }

    public getAvailableHours(weekDetails: any) {
        let minutes = this.getAvaiableMinutes(weekDetails);
        return Utility.hoursFromMinutes(minutes);
    }

    public getAvaiableMinutes(weekDetails: any) {

        // let plannedMinutes = this.getTotalMinutesOfGoals(weekDetails.categorizedTasks);
        // // console.log("type of total minutes" + typeof weekDetails.totalMinutes);
        // const availableMinutes =  weekDetails.totalMinutes - plannedMinutes;
        const availableMinutes =  weekDetails.totalMinutes - weekDetails.plannedMinutes;
        // console.log("available minutes " + availableMinutes);
        return availableMinutes;

    }

    public getGoal(weekDetails: any, goalId: string) {

        // console.log(typeof weekDetails.categorizedTasks);
        for (let catTask of weekDetails.categorizedTasks) {
            if (goalId === catTask.categoryId) {
                return catTask;
            }
        }

        return undefined;
    }

}


const weekService = new WeekService();
export default weekService;
