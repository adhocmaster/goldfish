import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Category,
  Item,
} from '../models';
import {CategoryRepository} from '../repositories';

export class CategoryItemController {
  constructor(
    @repository(CategoryRepository) protected categoryRepository: CategoryRepository,
  ) { }

  @get('/categories/{id}/items', {
    responses: {
      '200': {
        description: 'Array of Category has many Item',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Item)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Item>,
  ): Promise<Item[]> {
    return this.categoryRepository.items(id).find(filter);
  }

  @post('/categories/{id}/items', {
    responses: {
      '200': {
        description: 'Category model instance',
        content: {'application/json': {schema: getModelSchemaRef(Item)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Category.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Item, {
            title: 'NewItemInCategory',
            exclude: ['id'],
            optional: ['categoryId']
          }),
        },
      },
    }) item: Omit<Item, 'id'>,
  ): Promise<Item> {
    return this.categoryRepository.items(id).create(item);
  }

  @patch('/categories/{id}/items', {
    responses: {
      '200': {
        description: 'Category.Item PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Item, {partial: true}),
        },
      },
    })
    item: Partial<Item>,
    @param.query.object('where', getWhereSchemaFor(Item)) where?: Where<Item>,
  ): Promise<Count> {
    return this.categoryRepository.items(id).patch(item, where);
  }

  @del('/categories/{id}/items', {
    responses: {
      '200': {
        description: 'Category.Item DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Item)) where?: Where<Item>,
  ): Promise<Count> {
    return this.categoryRepository.items(id).delete(where);
  }
}
