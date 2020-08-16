import { UserServiceBindings } from '@loopback/authentication-jwt';
import { inject } from '@loopback/core';
import { repository } from '@loopback/repository';
import { HttpErrors } from '@loopback/rest';
import { securityId, UserProfile } from '@loopback/security';
import { CategorizedTasks, Week } from '../models';
import { WeekRepository } from '../repositories';
import { CustomUserService } from './user.service';

export class WeekService {


    constructor(
        @repository(WeekRepository)
        public weekRepository: WeekRepository,
        @inject(UserServiceBindings.USER_SERVICE)
        public userService: CustomUserService
    ) { }

    public async updateCategorizedTasksArr(currentUserProfile: UserProfile, weekId: string, categorizedTasksArr: CategorizedTasks[]) {


        if (await this.weekRepository.canEdit(weekId, currentUserProfile[securityId])) {

            let week = await this.weekRepository.findById(weekId);
            week.categorizedTasks = categorizedTasksArr;

            return await this.updateByIdWithoutSecurityCheck(weekId, week);


        } else {
            throw new HttpErrors.Unauthorized("Week not accessible");
        }

    }

    public async updateById(userProfile: UserProfile, id: string, week: Week) {

        if (await this.weekRepository.canEdit(id, userProfile[securityId])) {

            return await this.updateByIdWithoutSecurityCheck(id, week);

        } else {
            throw new HttpErrors.Unauthorized("Week not accessible");
        }


    }


    private async updateByIdWithoutSecurityCheck(id: string, week: Week) {
        week.modifiedAt = new Date();
        this.reCalculateTImes(week); // TODO do this at client end.
        await this.weekRepository.updateById(id, week);
        return this.weekRepository.findById(id);
    }

    protected reCalculateTImes(week: Week) {

        if (!week.categorizedTasks) {
            return;
        }

        let plannedMinutes = 0;
        let completedMinutes = 0;

        let catIndex: number;
        for (catIndex = 0; catIndex < week.categorizedTasks?.length; ++catIndex) {

            let catTasks = week.categorizedTasks[catIndex];
            plannedMinutes += catTasks.totalMinutes ?? 0;
            completedMinutes += catTasks.completedMinutes ?? 0;

        }

        week.plannedMinutes = plannedMinutes;
        week.completedMinutes = completedMinutes;

    }

    public async addCategory(currentUserProfile: UserProfile, weekId: string, category: CategorizedTasks) {
        
        if (await this.weekRepository.canEdit(weekId, currentUserProfile[securityId])) {

            let week = await this.weekRepository.findById(weekId);
            if (week.categorizedTasks) {

                if (this.categoryAlreadyExists(week, category)) {
                    throw new HttpErrors.Conflict("Category already exists in the week.");
                }

                if (! category.tasks ) {
                    category.tasks = []
                }
                
                week.categorizedTasks?.push(category);
            }
            else
                week.categorizedTasks = [category];

            return await this.updateByIdWithoutSecurityCheck(weekId, week);

        } else {
            throw new HttpErrors.Unauthorized("Week not accessible");
        }

    }

    public categoryAlreadyExists(week: Week, category: CategorizedTasks) {

        if (!week.categorizedTasks) {
            return false;
        }

        for (let existingCat  of week.categorizedTasks) {

            if (existingCat.categoryId ==  category.categoryId) {
                return true;
            }
            
        }

        return false;

    }

    public reCalculateCategoryTimes(category: CategorizedTasks) {

        
        if(!category.tasks) {
            return;
        }

        let plannedMinutes = 0;
        let completedMinutes = 0;

        let taskIndex: number;
        for (taskIndex = 0; taskIndex < category.tasks?.length; ++taskIndex) {

            let task = category.tasks[taskIndex];
            plannedMinutes += task.totalMinutes ?? 0;
            completedMinutes += task.completedMinutes ?? 0;

        }

        category.plannedMinutes = plannedMinutes;
        category.completedMinutes = completedMinutes;

    }

    public async updateCategory(currentUserProfile: UserProfile, weekId: string, category: CategorizedTasks) {
        
        if (await this.weekRepository.canEdit(weekId, currentUserProfile[securityId])) {

            let week = await this.weekRepository.findById(weekId);

            // this.reCalculateCategoryTimes(category); offloaded goal hour calculations to client end.
            // replaces existing category with the input category.
            if (week.categorizedTasks) {

                let catIndex: number;

                for (catIndex = 0; catIndex < week.categorizedTasks?.length; ++catIndex) {
        
                    let existingCat = week.categorizedTasks[catIndex];

                    if ( existingCat.categoryId == category.categoryId ) {
                        week.categorizedTasks[catIndex] = category;
                        return await this.updateByIdWithoutSecurityCheck(weekId, week);
                    }
                }
        
            }
            
            throw new HttpErrors.NotFound("No such category exists in the week.")

        } else {
            throw new HttpErrors.Unauthorized("Week not accessible");
        }

    }
}