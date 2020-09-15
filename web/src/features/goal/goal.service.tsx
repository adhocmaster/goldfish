import toastService from 'app/toast.service';
import axios from 'axios';
import { WeekActionType } from 'features/week/week.actions';
import weekService from 'features/week/week.service';
import actionManager from 'framework/ActionManager';
import config from "framework/Configuration";
import ResponseProcessor from 'framework/ResponseProcessor';
import Utility from 'framework/Utility';
import { ActionType } from 'app/actionTypes';

class GoalService {

    serviceUrl = config.getBackend() + "/categories";

    private handleDataError(errors: any[]) {
        actionManager.dispatch(WeekActionType.GOAL_ERROR, errors, true);
        toastService.error(errors);
    }

    private handleHttpError(error: any) {
        const errors = ResponseProcessor.getHTTPError(error);
        actionManager.dispatch(WeekActionType.GOAL_ERROR, errors, true);
        toastService.error(errors);
    }

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

                this.handleDataError(errors);

            }

        }).catch((error) => {
            
            this.handleHttpError(error);

        });

    }

    public createDefaultGoals(titlesWithColors:{title: string, color: string}[]) {
        
        axios.post(
            this.serviceUrl + "/defaults",
            titlesWithColors

        ).then( (result) => {
            
            const errors = ResponseProcessor.getError(result.data);

            if ( errors.length == 0 ) {

                console.log("got goals");
                // console.log(data);
                actionManager.dispatch(ActionType.DEFAULT_GOALS_ADDED, result.data, false);


            } else {

                this.handleDataError(errors);

            }

        }).catch((error) => {
            
            this.handleHttpError(error);

        });


    }

    public getDefaultGoals() {

        axios.get(
            this.serviceUrl

        ).then( (result) => {
            
            const errors = ResponseProcessor.getError(result.data);

            if ( errors.length == 0 ) {

                console.log("got goals");
                // console.log(data);
                actionManager.dispatch(ActionType.DEFAULT_GOALS_FETCHED, result.data, false);


            } else {

                this.handleDataError(errors);

            }

        }).catch((error) => {
            
            this.handleHttpError(error);

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
    
    public recordHours(weekDetails: any, goal: any, recordMinutes: number) {

        this.addTask(weekDetails, goal, {
            title: "NA", 
            isDummy: true,
            isDone: true,
            totalMinutes: recordMinutes,
            completedMinutes: recordMinutes
        });

    }

    public removeTaskById(weekDetails: any, goal: any, index: number) {

        toastService.message("Removign task at index: " + index);

        if( !goal.tasks ) { return }

        const clonedTasks = [...goal.tasks];

        clonedTasks.splice(index, 1); // removed one item from index.

        const clonedGoal = {...goal, tasks: clonedTasks};

        this.updateByClonedGoal(weekDetails, clonedGoal)


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

        this.updateByClonedGoal(weekDetails, clonedGoal);

    }

    public completeTask(weekDetails: any, goal: any, index: number) {

        // toastService.message("Removign task at index: " + index);

        if( !goal.tasks ) { return }

        const clonedTasks = [...goal.tasks];
        const clonedTask = {...clonedTasks[index]}
        
        clonedTask.isDone = true;
        clonedTask.completedMinutes = clonedTask.totalMinutes;

        clonedTasks[index] = clonedTask;

        const clonedGoal = {...goal, tasks: clonedTasks};

        this.updateByClonedGoal(weekDetails, clonedGoal)

    }

    public updateByClonedGoal(weekDetails: any, clonedGoal: any) {
        
        this.reCalculateGoalTimes(clonedGoal);

        weekService.updateGoalOfWeek(weekDetails, clonedGoal, clonedGoal);

    }


    public reCalculateGoalTimes(goal: any) {

        
        if(!goal.tasks) {
            goal.plannedMinutes = 0;
            goal.completedMinutes = 0;
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

    public getGoalAvailableMinutes(goal: any) {

        
        if(!goal.tasks) {
            return goal.totalMinutes;
        }
        // this.reCalculateGoalTimes(goal); // cannot change state here.
        return goal.totalMinutes - goal.plannedMinutes;

    }

    

}

export default new GoalService();