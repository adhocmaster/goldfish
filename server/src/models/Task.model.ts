import { Model } from '@loopback/rest'
import { property } from '@loopback/repository';

export class Task extends Model {

    @property({
        type: 'string',
        required: true
      })
    title: string;

    @property({
      type: 'number',
      required: true
    })
    taskNo: number;

    @property({
      type: 'boolean', default: false
    })
    isDone?: boolean;

    // dummy tasks are for recoding hours only.
    @property({
      type: 'boolean', default: false
    })
    isDummy?: boolean;
    
    @property({
      type: 'number',
      default: 0
    })
    totalMinutes?: number;

    @property({
        type: 'number',
        default: 0
    })
    completedMinutes?: number;
    
}