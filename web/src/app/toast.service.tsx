import actionManager from 'framework/ActionManager';
import { ActionType } from 'app/actionTypes';
import { RootState } from './store';
import { useSelector } from 'react-redux';


class ToastService {

    public message(message: any) {
        actionManager.dispatch(ActionType.TOAST, message);
    }
    public error(error: any) {
        actionManager.dispatch(ActionType.TOAST_ERROR, error);
    }

    public getMessage() {
        return useSelector( (state: RootState) => { return state.appState.toastMessage});
    }

    public getError() {
        return useSelector( (state: RootState) => { return state.appState.toastError});
    }

    public clearMessage() {
        actionManager.dispatch(ActionType.TOAST, undefined);
    }
    public clearError() {
        actionManager.dispatch(ActionType.TOAST_ERROR, undefined);
    }

}

export default new ToastService();