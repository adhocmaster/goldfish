import axios from 'axios';
import config from "framework/Configuration";
import ResponseProcessor from 'framework/ResponseProcessor';
import { WeekActionType } from 'features/week/week.actions';
import actionManager from 'framework/ActionManager';
import toastService from 'app/toast.service';
import Utility from 'framework/Utility';
import weekService from 'features/week/week.service';

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


    public getAvaiableMinutes(goal: any) {

        // console.log("type of total minutes" + typeof weekDetails.totalMinutes);
        let availableMinutes = goal.totalMinutes;
        if (goal.plannedMinutes)
            availableMinutes =  goal.totalMinutes - goal.plannedMinutes;
        // console.log("available minutes " + availableMinutes);
        return availableMinutes;
    }

    public getAvailableHours(goal: any) {
        return Utility.hoursFromMinutes(this.getAvaiableMinutes(goal));
    }

    public hasEnoughTimeFoTask(goal: any, task: any) {

        
        if (this.getAvaiableMinutes(goal) >= task.totalMinutes) {
            return true;
        }
        return false;

    }
    
    public addTask(weekDetails: any, goal: any, task: any) {


        const goalId = goal.categoryId;

        console.log(`adding task ${task} to ${goalId}`);
        // 1. check hours
        if( task.totalMinutes < 30 ) {
            throw new Error(`Minimum task time is half an hour, but your attempted to allocate ${Utility.hoursFromMinutes( task.totalMinutes )} h`)
        }

        if( !this.hasEnoughTimeFoTask(goal, task) ) {
            throw new Error(`You have ${this.getAvailableHours(goal)}, but your attempted to allocate ${Utility.hoursFromMinutes( task.totalMinutes )} h`)
        }

        let updatedTasks = [task];
        if (goal.tasks) {
            updatedTasks = [...goal.tasks, task];
        }
        const clonedGoal = {...goal, tasks: updatedTasks};

        this.reCalculateGoalTimes(clonedGoal);

        weekService.updateGoalOfWeek(weekDetails, clonedGoal, clonedGoal);

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
    

}

export default new GoalService();