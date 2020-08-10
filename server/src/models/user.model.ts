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


  constructor(data?: Partial<CustomUser>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = CustomUser & UserRelations;
