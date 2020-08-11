import { BindingKey } from '@loopback/core';
import { ActionSequence } from './user/action.sequence';

export namespace Bindings {
    export const ACCOUNT_ACTION_SEQUENCE: BindingKey<ActionSequence> = BindingKey.create('ACCOUNT_ACTION_SEQUENCE');
}
