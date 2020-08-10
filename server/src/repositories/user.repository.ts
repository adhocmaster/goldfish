import {DefaultCrudRepository} from '@loopback/repository';
import {CustomUser, UserRelations} from '../models';
import {GoldfishDataSource} from '../datasources';
import {inject} from '@loopback/core';
import {Credentials} from '../services/user.service';

export class UserRepository extends DefaultCrudRepository<
  CustomUser,
  typeof CustomUser.prototype.id,
  UserRelations
> {
  constructor(
    @inject('datasources.goldfish') dataSource: GoldfishDataSource,
  ) {
    super(CustomUser, dataSource);
  }

  public findCredentials(probableId: string | undefined): Credentials | undefined {

    if (probableId ==undefined) {
      return undefined;
    }
    this.findOne({
      where: {id: probableId}
    }).then(user => {

      if (!user) {
        return undefined;
      }
      return {
        email: user.email,
        password: user.password
      }
    }).catch(error => {
      throw error;
    })

  }
}
