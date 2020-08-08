import React from 'react';
import { ActionType } from 'app/actionTypes';
import cookies from 'framework/Cookie';
import userService from 'features/user/user.service';

export default function SettingsReducer(state: any, action: any) {

    const initialState = {
        'authToken': null,
        'email': null,
        'isLoggedIn': false
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
        userService.logout();

    }

    return state;
}