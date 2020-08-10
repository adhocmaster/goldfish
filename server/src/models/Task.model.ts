import { Model } from '@loopback/rest'
import { property } from '@loopback/repository';

export class Task extends Model {

    @property({
        type: 'string',
        required: true
      })
    name: string;

    @property({
      type: 'number',
      required: true
    })
    taskNo: number;

    @property({
      type: 'boolean', default: false
    })
    isDone?: boolean;
    
    @property({
        type: 'number', default: 0
      })
    hoursPlanned?: number;
    @property({
        type: 'number', default: 0
      })
    hoursSpend?: number;
}