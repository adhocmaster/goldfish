import { store } from 'app/store';

class ActionManager{

    private create(type: string, payload?: any, error?:boolean, meta?:any ) {

        let action:any = {
            type: type
        };

        if (payload) {
            action.payload = payload;
        }

        if (error) {
            action.error = error;
        }

        if (meta) {
            action.meta = meta;
        }

        return action;
    }

    public dispatch(type: string, payload?: any, error?:boolean, meta?:any ) {

        store.dispatch(this.create(type, payload, error, meta));
        
    }

}

const actionManager = new ActionManager();
export default actionManager;