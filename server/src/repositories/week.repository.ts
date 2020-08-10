import {DefaultCrudRepository} from '@loopback/repository';
import {Week, WeekRelations} from '../models';
import {GoldfishDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class WeekRepository extends DefaultCrudRepository<
  Week,
  typeof Week.prototype.id,
  WeekRelations
> {
  constructor(
    @inject('datasources.goldfish') dataSource: GoldfishDataSource,
  ) {
    super(Week, dataSource);
  }

  public async canEdit(weekId: string, userId: string) {

    const week = await this.findById(weekId);
    if ( week ) {
      if (week.userId == userId) {
        return true;
      }
    }

    return false;

  }
}
