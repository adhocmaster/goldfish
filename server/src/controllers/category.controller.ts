import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
  WhereBuilder,
  FilterBuilder,
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
import {Category} from '../models';
import {CategoryRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import { inject } from '@loopback/core';
import { UserServiceBindings } from '@loopback/authentication-jwt';
import { CustomUserService } from '../services/user.service';
import { title } from 'process';

@authenticate('jwt')
export class CategoryController {
  constructor(
    @repository(CategoryRepository)
    public categoryRepository : CategoryRepository,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService : CustomUserService
  ) {}

  @post('/categories', {
    responses: {
      '200': {
        description: 'Category model instance',
        content: {'application/json': {schema: getModelSchemaRef(Category)}},
      },
    },
  })
  async create(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Category, {
            title: 'NewCategory',
            exclude: ['id'],
          }),
        },
      },
    })
    category: Omit<Category, 'id'>,
  ): Promise<Category> {
    
    category.userId = currentUserProfile[securityId];
    return this.categoryRepository.create(category);
  }

  @post('/categories/defaults', {
    responses: {
      '200': {
        description: 'Category model instance',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Category, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async createDefaultCategories(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: getModelSchemaRef(Category),
          },
        },
      },
    })
    categories: Omit<Category, 'id'>[],
  ): Promise<Category[]> {

    // console.log(categories);
    
    let savedCategories = [];
    for (let category of categories) {

      if (!category.title) {
        continue;
      }

      const filterBuilder = new FilterBuilder<Category>();
      let filter = filterBuilder.build();

      let foundCategory = await this.findByTitle(currentUserProfile, category.title, filter);
      if (foundCategory.length > 0 ) {
        continue;
      }

      category.userId = currentUserProfile[securityId];
      await this.categoryRepository.create(category);

    }

    const filterBuilder = new FilterBuilder<Category>();
    let filter = filterBuilder.build();
    return this.find(currentUserProfile, filter);
    
  }

  

  @get('/categories/count', {
    responses: {
      '200': {
        description: 'Category model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Category) where?: Where<Category>,
  ): Promise<Count> {
    return this.categoryRepository.count(where);
  }

  @get('/categories', {
    responses: {
      '200': {
        description: 'Array of Category model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Category, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    @param.filter(Category) filter?: Filter<Category>,
  ): Promise<Category[]> {
    filter  = this.userService.addUserIdToFilter(filter, currentUserProfile);
    return this.categoryRepository.find(filter);
  }


  @patch('/categories', {
    responses: {
      '200': {
        description: 'Category PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Category, {partial: true}),
        },
      },
    })
    category: Category,
    @param.where(Category) where?: Where<Category>,
  ): Promise<Count> {
    return this.categoryRepository.updateAll(category, where);
  }


  @get('/categories/{id}', {
    responses: {
      '200': {
        description: 'Category model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Category, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    @param.path.string('id') id: string,
    @param.filter(Category, {exclude: 'where'}) filter?: FilterExcludingWhere<Category>
  ): Promise<Category> {
    filter  = this.userService.addUserIdToFilter(filter, currentUserProfile);
    return this.categoryRepository.findById(id, filter);
  }


  @get('/categories/title/{title}', {
    responses: {
      '200': {
        description: 'Category model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Category, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findByTitle(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    @param.path.string('title') title: string,
    @param.filter(Category) filter?: Filter<Category>
  ): Promise<Category[]> {
    filter  = this.userService.addUserIdToFilter(filter, currentUserProfile);
    const whereBuilder = new WhereBuilder(filter.where);
    let where = whereBuilder.and({title: title}).build();
    console.log(where);
    return this.categoryRepository.find(filter)
  }


  @patch('/categories/{id}', {
    responses: {
      '204': {
        description: 'Category PATCH success',
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
          schema: getModelSchemaRef(Category, {partial: true}),
        },
      },
    })
    category: Category,
  ): Promise<void> {

    throw new Error("Not implemented yet");
    await this.categoryRepository.updateById(id, category);
  }

  @put('/categories/{id}', {
    responses: {
      '204': {
        description: 'Category PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() category: Category,
  ): Promise<void> {
    await this.categoryRepository.replaceById(id, category);
  }

  @del('/categories/{id}', {
    responses: {
      '204': {
        description: 'Category DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.categoryRepository.deleteById(id);
  }
}
