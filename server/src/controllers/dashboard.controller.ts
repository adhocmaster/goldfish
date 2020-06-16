// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/core';

import {get} from '@loopback/rest'
import { authenticate } from '@loopback/authentication';

@authenticate('jwt')
export class DashboardController {
  constructor() {}

  @get('/hello')
  hello(): string {
    return 'hello world!';
  }

}
