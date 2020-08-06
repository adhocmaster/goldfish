import {ActionType} from 'app/actionTypes'

export default function SettingsReducer(state: any, action: any) {

    if ( state === undefined ) {
        state = {
            'authToken': null,
            'email': null,
            'isLoggedIn': false
        };
    }

    if (action.type == ActionType.ACCOUNT_LOGGEDIN) {

        let credentials = action.payload;
        return Object.assign({}, state, {
            'authToken': credentials['authToken'],
            'email': credentials['email'],
            'isLoggedIn': true
        });
    }

    if (action.type == ActionType.LOGIN_FAILED) {

        

    }

    return state;
}