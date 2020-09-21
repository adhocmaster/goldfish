import {UserService} from '@loopback/authentication';
import {repository, Where, WhereBuilder, Filter, FilterBuilder} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import {genSalt, hash} from 'bcryptjs';
import {compare} from 'bcryptjs';
// User --> MyUser
import {CustomUser} from '../models';
// UserRepository --> MyUserRepository
import CustomUserRepository from '../repositories/user.repository';
import { inject } from '@loopback/core';
import { Bindings } from '../bindings';
import { ActionSequence } from '../user/action.sequence';

export type Credentials = {
  email: string;
  password: string;
};

// User --> MyUser
export class CustomUserService implements UserService<CustomUser, Credentials> {
  constructor(
    // UserRepository --> MyUserRepository
    @repository(CustomUserRepository) public userRepository: CustomUserRepository
  ) {}


  async findById(id: string) {
    return this.userRepository.findById(id);
  }

  // User --> MyUser
  async verifyCredentials(credentials: Credentials): Promise<CustomUser> {
    const invalidCredentialsError = 'Invalid email or password.';

    // console.log("input credentials:");
    // console.log(credentials);

    const foundUser = await this.userRepository.findOne({
      where: {email: credentials.email},
    });


    if (!foundUser) {
      throw new HttpErrors.Unauthorized(invalidCredentialsError);
    }

    const credentialsFound = await this.userRepository.findCredentials(
      foundUser.id,
    );
    
    if (!credentialsFound) {
      throw new HttpErrors.Unauthorized(invalidCredentialsError);
    }

    const passwordMatched = await compare(
      credentials.password,      
      credentialsFound.password,
    );

    if (!passwordMatched) {
      throw new HttpErrors.Unauthorized(invalidCredentialsError);
    }

    return foundUser;
  }

  // User --> MyUser
  convertToUserProfile(user: CustomUser): UserProfile {

    if (user.id == undefined) {
        throw new HttpErrors.InternalServerError("user id null");
    }
    return {
      [securityId]: user.id,
      name: user.name,
      id: user.id,
      email: user.email,
    };
  }

  addUserIdToWhere(where:Where<any> | undefined, userProfile:UserProfile) {

    const whereBuilder = new WhereBuilder(where);
    where = whereBuilder.eq("userId", userProfile[securityId]).build();
    return where

  }
  addUserIdToFilter(filter:Filter<any> | undefined, userProfile:UserProfile) {

    if (filter) {

      const where = this.addUserIdToWhere(filter.where, userProfile);
      filter.where = where

    } else {

      const where = this.addUserIdToWhere(undefined, userProfile);
      const filterBuilder = new FilterBuilder(filter);
      filter = filterBuilder.where(where).build();

    }

    return filter

  }


}