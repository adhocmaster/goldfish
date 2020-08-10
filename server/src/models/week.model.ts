import {Entity, model, property, hasMany} from '@loopback/repository';
import { type } from 'os';
import { CategorizedTasks } from '../models';

@model()
export class Week extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    generated: true,
  })
  userId?: string;

  @property({
    type: 'string',
  })
  goal?: string;

  @property({
    type: 'date',
    required: true,
  })
  dateStart: string;

  @property({
    type: 'number',
    default: 7,
  })
  days?: number;

  @property({
    type: 'array',
    itemType: 'any'
  })
  categorizedTasks?: CategorizedTasks[]



  constructor(data?: Partial<Week>) {
    super(data);
  }
}

export interface WeekRelations {
  // describe navigational properties here
}

export type WeekWithRelations = Week & WeekRelations;
