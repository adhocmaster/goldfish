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
  })
  userId?: string;
  
  @property({
    type: 'date',
    default: () => new Date(),
  })
  createdAt?: Date;

  @property({
    type: 'date',
    default: () => new Date(),
  })
  modifiedAt?: Date;

  @property({
    type: 'string',
  })
  title?: string;

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
    type: 'string',
  })
  schedule?: string;

  @property({
      type: 'number',
      default: 0
  })
  totalMinutes?: number;
  
  @property({
      type: 'number',
      default: 0
  })
  plannedMinutes?: number;

  @property({
      type: 'number',
      default: 0
  })
  completedMinutes?: number;
  
  @property({
    type: 'string',
    default: 0
  })
  hoursPerWeekDays?: string

  @property({
    type: 'string',
    default: 0
  })
  hoursPerWeekWeekends?: string


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
