import {ActionType} from 'app/actionTypes'

export default function SettingsReducer(state: any, action: any) {

    if ( state === undefined ) {
        state = {
            'authToken': null,
            'email': null,
        };
    }

    if (action.type == ActionType.ACCOUNT_LOGGEDIN) {

        let credentials = action.payload;
        return Object.assign({}, state, {
            'authToken': credentials['authToken'],
            'email': credentials['email'],
        });

    }

    return state;
}