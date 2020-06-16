import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {Item, ItemRelations, Category} from '../models';
import {GoldfishDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {CategoryRepository} from './category.repository';

export class ItemRepository extends DefaultCrudRepository<
  Item,
  typeof Item.prototype.id,
  ItemRelations
> {

  public readonly category: BelongsToAccessor<Category, typeof Item.prototype.id>;

  constructor(
    @inject('datasources.goldfish') dataSource: GoldfishDataSource, @repository.getter('CategoryRepository') protected categoryRepositoryGetter: Getter<CategoryRepository>,
  ) {
    super(Item, dataSource);
    this.category = this.createBelongsToAccessorFor('category', categoryRepositoryGetter,);
    this.registerInclusionResolver('category', this.category.inclusionResolver);
  }
}
