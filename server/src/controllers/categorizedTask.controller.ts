import {
    Count,
    CountSchema,
    Filter,
    FilterExcludingWhere,
    repository,
    Where,
    WhereBuilder,
} from '@loopback/repository';
import {
    post,
    param,
    get,
    getModelSchemaRef,
    patch,
    put,
    del,
    requestBody,
    HttpErrors,
} from '@loopback/rest';
import { Week, CategorizedTasks, Category } from '../models';
import { WeekRepository, CategoryRepository } from '../repositories';
import { authenticate } from '@loopback/authentication';
import { SecurityBindings, securityId, UserProfile } from '@loopback/security';
import { inject } from '@loopback/core';
import { UserServiceBindings } from '@loopback/authentication-jwt';
import { CustomUserService } from '../services/user.service';
import { Bindings } from '../bindings';
import { WeekService } from '../services/week.service';

@authenticate('jwt')
export class CategorizedTaskController {
    constructor(
        @repository(CategoryRepository)
        public categoryRepository : CategoryRepository,
        @repository(WeekRepository)
        public weekRepository: WeekRepository,
        @inject(Bindings.WEEK_SERVICE)
        public weekService: WeekService,
        @inject(UserServiceBindings.USER_SERVICE)
        public userService: CustomUserService
    ) { }


    @patch('/weeks/all-categories/{weekId}', {
        responses: {
            '200': {
                description: 'Week PATCH success',
                content: { 'application/json': { schema: getModelSchemaRef(Week) } },
            },
        },
    })
    async updateAllByWeekId(
        @inject(SecurityBindings.USER)
        currentUserProfile: UserProfile,
        @param.path.string('weekId') weekId: string,
        @requestBody({
            content: {
                'application/json': {
                    schema: getModelSchemaRef(CategorizedTasks, { partial: true }),
                },
            },
        })
        categorizedTasksArr: CategorizedTasks[],
    ): Promise<Week> {

        return this.weekService.updateCategorizedTasksArr(currentUserProfile, weekId, categorizedTasksArr);

    }


    @patch('/weeks/category/{weekId}', {
        responses: {
            '200': {
                description: 'Week PATCH success',
                content: { 'application/json': { schema: getModelSchemaRef(Week) } },
            },
        },
    })
    async updateByWeekIdAndId(
        @inject(SecurityBindings.USER)
        currentUserProfile: UserProfile,
        @param.path.string('weekId') weekId: string,
        @requestBody({
            content: {
                'application/json': {
                    schema: getModelSchemaRef(CategorizedTasks, { partial: true }),
                },
            },
        })
        category: CategorizedTasks,
    ): Promise<Week> {

        return this.weekService.updateCategory(currentUserProfile, weekId, category);

    }


    @post('/weeks/category/{weekId}', {
        responses: {
            '200': {
                description: 'Week model instance',
                content: { 'application/json': { schema: getModelSchemaRef(Week) } },
            },
        },
    })
    async create(
        @inject(SecurityBindings.USER)
        currentUserProfile: UserProfile,
        @param.path.string('weekId') weekId: string,
        @requestBody({
            content: {
                'application/json': {
                    schema: getModelSchemaRef(CategorizedTasks, { partial: true }),
                },
            },
        })
        category: CategorizedTasks,
    ): Promise<Week> {

        return this.weekService.addCategory(currentUserProfile, weekId, category);

    }


    @post('/weeks/new-category/{weekId}/{totalMinutes}', {
        responses: {
            '200': {
                description: 'Week model instance',
                content: { 'application/json': { schema: getModelSchemaRef(Week) } },
            },
        },
    })
    async createWithNewCategory(
        @inject(SecurityBindings.USER)
        currentUserProfile: UserProfile,
        @param.path.string('weekId') weekId: string,
        @param.path.number('totalMinutes') totalMinutes: number,
        @requestBody({
            content: {
                'application/json': {
                    schema: getModelSchemaRef(CategorizedTasks, { partial: true }),
                },
            },
        })
        category: Category,
    ): Promise<Week> {

        category.userId = currentUserProfile[securityId];
        const savedCategory = await this.categoryRepository.create(category);
        const categorizedTasks = new CategorizedTasks();
        categorizedTasks.categoryId = savedCategory.id;
        categorizedTasks.title = savedCategory.title;
        categorizedTasks.totalMinutes = totalMinutes;
        // categorizedTasks.plannedMinutes = 0;
        // categorizedTasks.completedMinutes = 0;
        return this.weekService.addCategory(currentUserProfile, weekId, categorizedTasks);

    }
    

    @del('/weeks/category/{weekId}/{id}', {
        responses: {
            '200': {
                description: 'Week model instance',
                content: { 'application/json': { schema: getModelSchemaRef(Week) } },
            },
        },
    })
    async deleteById(
        @inject(SecurityBindings.USER)
        currentUserProfile: UserProfile,
        @param.path.string('weekId') weekId: string,
        @param.path.string('id') categoryId: string
    ): Promise<Week> {
        
      return this.weekService.removeCategory(currentUserProfile, weekId, categoryId);
    }


}