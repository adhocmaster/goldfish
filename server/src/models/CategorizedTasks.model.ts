import { Model } from '@loopback/rest';
import { Task } from './Task.model';
import { property } from '@loopback/repository';


export class CategorizedTasks extends Model {

    @property({
        type: 'string',
        required: true
      })
    categoryId: string;

    @property({
        type: 'array',
        itemType: 'any'
      })
    tasks: Task[];


    addTask(task: Task) {
        this.tasks.push(task);
    }

    removeTask(taskNo: number) {
        let foundKey = -1;
        for (let key in this.tasks) {
            if (this.tasks[key].taskNo == taskNo) {
                foundKey= parseInt(key);
                break;
            }
        }

        if (foundKey) {
            delete this.tasks[foundKey];
        }

    }
}