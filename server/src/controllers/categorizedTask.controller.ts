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
  import {Week, CategorizedTasks} from '../models';
  import {WeekRepository} from '../repositories';
  import { authenticate } from '@loopback/authentication';
  import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
  import { inject } from '@loopback/core';
  import { UserServiceBindings } from '@loopback/authentication-jwt';
  import { CustomUserService } from '../services/user.service';
import { Bindings } from '../bindings';
import { WeekService } from '../services/week.service';
  
  @authenticate('jwt')
  export class CategorizedTaskController {
    constructor(
      @repository(WeekRepository)
      public weekRepository : WeekRepository,
      @inject(Bindings.WEEK_SERVICE)
      public weekService : WeekService,
      @inject(UserServiceBindings.USER_SERVICE)
      public userService : CustomUserService
    ) {}
    

    @patch('/weeks/all-categories/{weekId}', {
        responses: {
          '200': {
            description: 'Week PATCH success',
            content: "{}"
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
              schema: getModelSchemaRef(CategorizedTasks, {partial: true}),
            },
          },
        })
        categorizedTasks: CategorizedTasks[],
      ): Promise<any> {
    
        return this.weekService.updateCategorizedTasks(currentUserProfile, weekId, categorizedTasks);
    
    }

  }