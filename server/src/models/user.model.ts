import {Entity, model, property} from '@loopback/repository';
import { User } from '@loopback/authentication-jwt';

@model()
export class CustomUser extends User {

  @property({
    type: 'string',
    required: true,
  })
  password: string;
  
  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'date',
  })
  dob?: string;

  @property({
    type: 'string',
    default: null
  })
  nextAction?: string

  @property({
    type: 'number',
    default: 0
  })
  hoursPerWeekDays?: number

  @property({
    type: 'number',
    default: 0
  })
  hoursPerWeekWeekends?: number

  constructor(data?: Partial<CustomUser>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = CustomUser & UserRelations;
