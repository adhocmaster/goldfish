// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: @loopback/example-todo-jwt
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {authenticate, TokenService} from '@loopback/authentication';
import {
  Credentials,
  MyUserService,
  TokenServiceBindings,
  UserServiceBindings,
} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {model, property, repository} from '@loopback/repository';
import {get, getModelSchemaRef, post, requestBody, HttpErrors} from '@loopback/rest';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {genSalt, hash} from 'bcryptjs';
import _ from 'lodash';
import UserRepository from '../repositories/user.repository';
import {CustomUser} from '../models/user.model';
import { ActionSequence } from '../user/action.sequence';
import { Bindings } from '../bindings';

@model()
export class NewUserRequest extends CustomUser {
}

const CredentialsSchema = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
      minLength: 4,
    },
  },
};

export const CredentialsRequestBody = {
  description: 'The input of login function',
  required: true,
  content: {
    'application/json': {schema: CredentialsSchema},
  },
};

export class UserController {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: MyUserService,
    @inject(SecurityBindings.USER, {optional: true})
    public user: UserProfile,
    @inject(UserServiceBindings.USER_REPOSITORY) protected userRepository: UserRepository,
    @inject(Bindings.ACCOUNT_ACTION_SEQUENCE) public accountActionSequence: ActionSequence
  ) {}

  @post('/users/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object'
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody(CredentialsRequestBody) credentials: Credentials,
  ): Promise<any> {
    // ensure the user exists, and the password is correct
    const user = await this.userService.verifyCredentials(credentials);
    // convert a User object into a UserProfile object (reduced set of properties)
    const userProfile = this.userService.convertToUserProfile(user);

    // create a JSON Web Token based on the user profile
    const token = await this.jwtService.generateToken(userProfile);
    // const user = await this.userRepository.findById(userProfile[securityId]);
    const userWithAuth = {...user, authToken: token};
    return _.omit(userWithAuth, ["password"]);
  }

  @authenticate('jwt')
  @get('/whoAmI', {
    responses: {
      '200': {
        description: '',
        schema: {
          type: 'string',
        },
      },
    },
  })
  async whoAmI(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<string> {
    return currentUserProfile[securityId];
  }

  @authenticate('jwt')
  @get('/myDetails', {
    responses: {
      '200': {
        description: '',
        schema: {
          'x-ts-type': CustomUser,
        },
      },
    },
  })
  async myDetails(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<CustomUser> {
    let foundUser = await this.userRepository.findById(currentUserProfile[securityId]);
    foundUser.password = "";
    return foundUser;
  }


  @post('/users/signup', {
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': CustomUser,
            },
          },
        },
      },
    },
  })
  async signUp(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(NewUserRequest, {
            title: 'NewUser',
          }),
        },
      },
    })
    newUserRequest: NewUserRequest,
  ): Promise<CustomUser> {
    const password = await hash(newUserRequest.password, 4);
    newUserRequest.password = password
    newUserRequest.nextAction = this.accountActionSequence.first();
    const savedUser = await this.userRepository.create(newUserRequest);
    // const savedUser = await this.userRepository.create(
    //   _.omit(newUserRequest, 'password'),
    // );

    // await this.userRepository.userCredentials(savedUser.id).create({password});

    return savedUser;
  }


  @authenticate('jwt')
  @post('/users/next-action', {
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': CustomUser,
            },
          },
        },
      },
    },
  })
  async nextAction(
    
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<any> {

    let user = await this.userRepository.findById(currentUserProfile[securityId]);

    if( !user ) {
      throw new HttpErrors.NotFound("user not found with id: " + currentUserProfile[securityId]);
    }

    console.log(user);
    user.nextAction = this.accountActionSequence.next(user.nextAction);
    this.userRepository.updateById(user.id, user);

    console.log(user);

    return _.omit(user, ["password"]);

  }


}
