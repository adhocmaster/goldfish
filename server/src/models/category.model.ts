import {Entity, model, property, hasMany} from '@loopback/repository';
import {Item, ItemWithRelations} from './item.model';

@model()
export class Category extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    default: '#aaaaaa',
  })
  color?: string;

  @property({
    type: 'number',
    default: 0,
  })
  order?: number;

  @hasMany(() => Item)
  items: Item[];

  constructor(data?: Partial<Category>) {
    super(data);
  }
}

export interface CategoryRelations {
  // describe navigational properties here
  items?: ItemWithRelations[];

}

export type CategoryWithRelations = Category & CategoryRelations;
