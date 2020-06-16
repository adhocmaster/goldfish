import {Entity, model, property} from '@loopback/repository';

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


  constructor(data?: Partial<Week>) {
    super(data);
  }
}

export interface WeekRelations {
  // describe navigational properties here
}

export type WeekWithRelations = Week & WeekRelations;
