import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
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
} from '@loopback/rest';
import {Week} from '../models';
import {WeekRepository} from '../repositories';
import { authenticate } from '@loopback/authentication';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import { inject } from '@loopback/core';

export class WeekController {
  constructor(
    @repository(WeekRepository)
    public weekRepository : WeekRepository,
  ) {}

  @authenticate('jwt')
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
    @param.where(Week) where?: Where<Week>,
  ): Promise<Count> {
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
    @param.filter(Week) filter?: Filter<Week>,
  ): Promise<Week[]> {
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
    @param.path.string('id') id: string,
    @param.filter(Week, {exclude: 'where'}) filter?: FilterExcludingWhere<Week>
  ): Promise<Week> {
    return this.weekRepository.findById(id, filter);
  }

  @patch('/weeks/{id}', {
    responses: {
      '204': {
        description: 'Week PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Week, {partial: true}),
        },
      },
    })
    week: Week,
  ): Promise<void> {
    await this.weekRepository.updateById(id, week);
  }

  @put('/weeks/{id}', {
    responses: {
      '204': {
        description: 'Week PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() week: Week,
  ): Promise<void> {
    await this.weekRepository.replaceById(id, week);
  }

  @del('/weeks/{id}', {
    responses: {
      '204': {
        description: 'Week DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.weekRepository.deleteById(id);
  }
}
