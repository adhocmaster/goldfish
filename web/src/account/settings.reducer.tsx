import React from 'react';
import { ActionType } from 'app/actionTypes';
import cookies from 'framework/Cookie';
import userService from 'features/user/user.service';

export default function SettingsReducer(state: any, action: any) {

    const initialState = {
        'authToken': null,
        'email': null,
        'isLoggedIn': false,
        name: undefined,
        accountErrors: []
    };

    if ( state === undefined ) {
        state = initialState;
    }

    if (action.type == ActionType.ACCOUNT_LOGGEDIN) {

        let credentials = action.payload;


        return Object.assign({}, state, {
            'authToken': credentials['authToken'],
            'email': credentials['email'],
            'isLoggedIn': true
        });

    } else if (action.type == ActionType.APP_STARTING) {

        state = {...state, ...userService.fromCookie()};

    } else if (action.type == ActionType.LOG_OUT) {

        state = initialState;

    } else if (action.type == ActionType.LOGIN_FAILED) {

        state = {...state, loginErrors: action.payload};
        console.log(state);

    }

    switch(action.type) {

        case ActionType.ACCOUNT_ERROR:

            let errors = action.payload;
            let accountErrors = [];

            if (Array.isArray(errors)) {
                accountErrors = errors;
            } else {
                accountErrors.push(errors);
            }

            state = {...state, accountErrors: accountErrors}
            break;
        
        case ActionType.ACCOUNT_CREATED:
            state = {...state, ...action.payload};
            break;

    }


    return state;
}