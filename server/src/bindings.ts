import { BindingKey } from '@loopback/core';
import { ActionSequence } from './user/action.sequence';
import { WeekService } from './services/week.service';

export namespace Bindings {
    export const ACCOUNT_ACTION_SEQUENCE: BindingKey<ActionSequence> = BindingKey.create('ACCOUNT_ACTION_SEQUENCE');
    export const WEEK_SERVICE: BindingKey<WeekService> = BindingKey.create('WEEL_SERVICE');
}
