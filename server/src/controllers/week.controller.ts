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
import {Week} from '../models';
import {WeekRepository} from '../repositories';
import { authenticate } from '@loopback/authentication';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import { inject } from '@loopback/core';
import { UserServiceBindings } from '@loopback/authentication-jwt';
import { CustomUserService } from '../services/user.service';
import { Bindings } from '../bindings';
import { WeekService } from '../services/week.service';

@authenticate('jwt')
export class WeekController {
  constructor(
    @repository(WeekRepository)
    public weekRepository : WeekRepository,
    @inject(Bindings.WEEK_SERVICE)
    public weekService : WeekService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService : CustomUserService
  ) {}

  @post('/weeks', {
    responses: {
      '200': {
        description: 'Week model instance',
        content: {'application/json': {schema: getModelSchemaRef(Week)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Week, {
            title: 'NewWeek',
            exclude: ['id'],
          }),
        },
      },
    })
    week: Omit<Week, 'id'>,
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile
  ): Promise<Week> {
    week.userId = currentUserProfile[securityId];
    return this.weekRepository.create(week);
  }

  @get('/weeks/count', {
    responses: {
      '200': {
        description: 'Week model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    @param.where(Week) where?: Where<Week>
  ): Promise<Count> {

    where  = this.userService.addUserIdToWhere(where, currentUserProfile);
    return this.weekRepository.count(where);
  }

  @get('/weeks', {
    responses: {
      '200': {
        description: 'Array of Week model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Week, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    @param.filter(Week) filter?: Filter<Week>,
  ): Promise<Week[]> {
    filter  = this.userService.addUserIdToFilter(filter, currentUserProfile);
    return this.weekRepository.find(filter);
  }

  @patch('/weeks', {
    responses: {
      '200': {
        description: 'Week PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,

    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Week, {partial: true}),
        },
      },
    })
    week: Week,

    @param.where(Week) where?: Where<Week>,
  ): Promise<Count> {

    where  = this.userService.addUserIdToWhere(where, currentUserProfile);
    return this.weekRepository.updateAll(week, where);
  }

  @get('/weeks/{id}', {
    responses: {
      '200': {
        description: 'Week model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Week, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    @param.path.string('id') id: string,
    @param.filter(Week, {exclude: 'where'}) filter?: FilterExcludingWhere<Week>
  ): Promise<Week> {
    filter  = this.userService.addUserIdToFilter(filter, currentUserProfile);
    return this.weekRepository.findById(id, filter);
  }

  @patch('/weeks/{id}', {
    responses: {
      '200': {
        description: 'Week PATCH success',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Week, {includeRelations: true}),
          },
        },
      },
    },
  })
  async updateById(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Week, {partial: true}),
        },
      },
    })
    week: Week,
  ): Promise<Week> {

    return this.weekService.updateById(currentUserProfile, id, week);

  }

  @put('/weeks/{id}', {
    responses: {
      '200': {
        description: 'Week PUT success',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Week, {includeRelations: true}),
          },
        },
      },
    },
  })
  async replaceById(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    @param.path.string('id') id: string,
    @requestBody() week: Week,
  ): Promise<Week> {
    
    week.modifiedAt = new Date();

    if (await this.weekRepository.canEdit(id, currentUserProfile[securityId])) {
      await this.weekRepository.replaceById(id, week);
      return this.weekRepository.findById(id);
    } else {
      throw new HttpErrors.Unauthorized("Week not accessible");
    }
  }

  @del('/weeks/{id}', {
    responses: {
      '204': {
        description: 'Week DELETE success',
      },
    },
  })
  async deleteById(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    @param.path.string('id') id: string
    ): Promise<void> {
    
    if (await this.weekRepository.canEdit(id, currentUserProfile[securityId])) {
      await this.weekRepository.deleteById(id);
    } else {
      throw new HttpErrors.Unauthorized("Week not accessible");
    }
  }
}
