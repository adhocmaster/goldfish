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
import {Item} from '../models';
import {ItemRepository} from '../repositories';

export class ItemController {
  constructor(
    @repository(ItemRepository)
    public itemRepository : ItemRepository,
  ) {}

  @post('/items', {
    responses: {
      '200': {
        description: 'Item model instance',
        content: {'application/json': {schema: getModelSchemaRef(Item)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Item, {
            title: 'NewItem',
            exclude: ['id'],
          }),
        },
      },
    })
    item: Omit<Item, 'id'>,
  ): Promise<Item> {
    return this.itemRepository.create(item);
  }

  @get('/items/count', {
    responses: {
      '200': {
        description: 'Item model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Item) where?: Where<Item>,
  ): Promise<Count> {
    return this.itemRepository.count(where);
  }

  @get('/items', {
    responses: {
      '200': {
        description: 'Array of Item model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Item, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Item) filter?: Filter<Item>,
  ): Promise<Item[]> {
    return this.itemRepository.find(filter);
  }

  @patch('/items', {
    responses: {
      '200': {
        description: 'Item PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Item, {partial: true}),
        },
      },
    })
    item: Item,
    @param.where(Item) where?: Where<Item>,
  ): Promise<Count> {
    return this.itemRepository.updateAll(item, where);
  }

  @get('/items/{id}', {
    responses: {
      '200': {
        description: 'Item model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Item, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Item, {exclude: 'where'}) filter?: FilterExcludingWhere<Item>
  ): Promise<Item> {
    return this.itemRepository.findById(id, filter);
  }

  @patch('/items/{id}', {
    responses: {
      '204': {
        description: 'Item PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Item, {partial: true}),
        },
      },
    })
    item: Item,
  ): Promise<void> {
    await this.itemRepository.updateById(id, item);
  }

  @put('/items/{id}', {
    responses: {
      '204': {
        description: 'Item PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() item: Item,
  ): Promise<void> {
    await this.itemRepository.replaceById(id, item);
  }

  @del('/items/{id}', {
    responses: {
      '204': {
        description: 'Item DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.itemRepository.deleteById(id);
  }
}
