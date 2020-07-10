import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Category, CategoryWithRelations} from './category.model';

@model()
export class Item extends Entity {
  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'date',
    required: true,
  })
  dateCreated: string;

  @property({
    type: 'date',
  })
  dateDone?: string;

  @property({
    type: 'number',
    required: true,
  })
  priority: number;

  @property({
    type: 'number',
    required: true,
    default: 0
  })
  minutes: number;

  @belongsTo(() => Category)
  categoryId: string;

  constructor(data?: Partial<Item>) {
    super(data);
  }
}

export interface ItemRelations {
  // describe navigational properties here
  category?: CategoryWithRelations;

}

export type ItemWithRelations = Item & ItemRelations;
