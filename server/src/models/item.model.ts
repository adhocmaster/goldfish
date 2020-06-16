import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Category} from './category.model';

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

  @belongsTo(() => Category)
  categoryId: string;

  constructor(data?: Partial<Item>) {
    super(data);
  }
}

export interface ItemRelations {
  // describe navigational properties here
}

export type ItemWithRelations = Item & ItemRelations;
