import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {Category, CategoryRelations, Item} from '../models';
import {GoldfishDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {ItemRepository} from './item.repository';

export class CategoryRepository extends DefaultCrudRepository<
  Category,
  typeof Category.prototype.id,
  CategoryRelations
> {

  public readonly items: HasManyRepositoryFactory<Item, typeof Category.prototype.id>;

  constructor(
    @inject('datasources.goldfish') 
    dataSource: GoldfishDataSource, 
    @repository.getter('ItemRepository') 
    protected itemRepositoryGetter: Getter<ItemRepository>,
  ) {
    super(Category, dataSource);
    this.items = this.createHasManyRepositoryFactoryFor('items', itemRepositoryGetter,);
    this.registerInclusionResolver('items', this.items.inclusionResolver);
  }
}
