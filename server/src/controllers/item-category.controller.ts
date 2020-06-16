import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Item,
  Category,
} from '../models';
import {ItemRepository} from '../repositories';

export class ItemCategoryController {
  constructor(
    @repository(ItemRepository)
    public itemRepository: ItemRepository,
  ) { }

  @get('/items/{id}/category', {
    responses: {
      '200': {
        description: 'Category belonging to Item',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Category)},
          },
        },
      },
    },
  })
  async getCategory(
    @param.path.string('id') id: typeof Item.prototype.id,
  ): Promise<Category> {
    return this.itemRepository.category(id);
  }
}
