
import actionManager from 'framework/ActionManager';
import { ActionType } from './actionTypes';

export default function AppReducer(state: any, action: any) {

    if( state === undefined) {
        state = { 
        };
    }
    switch(action.type) {

        case ActionType.TOAST:
            state = {...state, toastMessage: action.payload}
            break;

        case ActionType.TOAST_ERROR:
            state = {...state, toastError: action.payload}
            break;

    }

    return state;

}
