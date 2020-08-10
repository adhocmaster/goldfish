import {UserService} from '@loopback/authentication';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import {genSalt, hash} from 'bcryptjs';
import {compare} from 'bcryptjs';
// User --> MyUser
import {CustomUser} from '../models';
// UserRepository --> MyUserRepository
import CustomUserRepository from '../repositories/user.repository';

export type Credentials = {
  email: string;
  password: string;
};

// User --> MyUser
export class CustomUserService implements UserService<CustomUser, Credentials> {
  constructor(
    // UserRepository --> MyUserRepository
    @repository(CustomUserRepository) public userRepository: CustomUserRepository,
  ) {}

  // User --> MyUser
  async verifyCredentials(credentials: Credentials): Promise<CustomUser> {
    const invalidCredentialsError = 'Invalid email or password.';

    // console.log("input credentials:");
    // console.log(credentials);

    const foundUser = await this.userRepository.findOne({
      where: {email: credentials.email},
    });

    // console.log("found user:");
    // console.log(foundUser);

    if (!foundUser) {
      throw new HttpErrors.Unauthorized(invalidCredentialsError);
    }

    const credentialsFound = await this.userRepository.findCredentials(
      foundUser.id,
    );
    // console.log("credentialsFound:");
    // console.log(credentialsFound);
    if (!credentialsFound) {
      throw new HttpErrors.Unauthorized(invalidCredentialsError);
    }

    // const hashedPassword = await hash(credentials.password, 4);

    const passwordMatched = await compare(
      credentials.password,      
      credentialsFound.password,
    );
    // console.log("passwordMatched:");
    // console.log(passwordMatched);

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
}