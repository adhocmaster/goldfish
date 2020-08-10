import {DefaultCrudRepository, HasOneRepositoryFactory} from '@loopback/repository';
import {CustomUser, UserRelations} from '../models';
import {GoldfishDataSource} from '../datasources';
import {inject} from '@loopback/core';
import {Credentials} from '../services/user.service';
import { UserServiceBindings, UserCredentialsRepository, UserCredentials } from '@loopback/authentication-jwt';

export default class CustomUserRepository extends DefaultCrudRepository<
  CustomUser,
  typeof CustomUser.prototype.id,
  UserRelations
> {
  
  userCredentials: HasOneRepositoryFactory<UserCredentials, typeof CustomUser.prototype.id>;

  constructor(
    @inject('datasources.goldfish') dataSource: GoldfishDataSource,
    @inject(UserServiceBindings.USER_CREDENTIALS_REPOSITORY)
    credentialRepo: UserCredentialsRepository
  ) {
    super(CustomUser, dataSource);
  }
  

  async findCredentials(probableId: string | undefined): Promise<UserCredentials | undefined>{

    // console.log('findCredentials');
    // console.log(probableId);

    if (probableId == undefined) {
      return undefined;
    }
    
    const foundUser = await this.findOne({
      where: {id: probableId}
    });

    // console.log('foundUser');
    // console.log(foundUser);

    if (!foundUser) {
      return undefined;
    }
    // console.log({
    //   id: foundUser.id,
    //   password: foundUser.password,
    //   userId: foundUser.id
    // });

    return new UserCredentials( {
      id: foundUser.id,
      password: foundUser.password,
      userId: foundUser.id
    });
    
  }
}
