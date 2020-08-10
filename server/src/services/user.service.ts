import {UserService} from '@loopback/authentication';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import {compare} from 'bcryptjs';
// User --> MyUser
import {CustomUser} from '../models';
// UserRepository --> MyUserRepository
import {UserRepository} from '../repositories';

export type Credentials = {
  email: string;
  password: string;
};

// User --> MyUser
export class CustomUserService implements UserService<CustomUser, Credentials> {
  constructor(
    // UserRepository --> MyUserRepository
    @repository(UserRepository) public userRepository: UserRepository,
  ) {}

  // User --> MyUser
  async verifyCredentials(credentials: Credentials): Promise<CustomUser> {
    const invalidCredentialsError = 'Invalid email or password.';

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
}