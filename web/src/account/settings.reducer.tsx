import React from 'react';
import { ActionType } from 'app/actionTypes';
import cookies from 'framework/Cookie';
import userService from 'features/user/user.service';
import goalService from 'features/goal/goal.service';

export default function SettingsReducer(state: any, action: any) {

    console.log(state);

    const initialState = {
        'authToken': null,
        'email': null,
        'isLoggedIn': false,
        name: undefined
    };

    if ( state === undefined ) {
        state = initialState;
    }

    if (action.type == ActionType.APP_STARTING) {

        state = {...state, ...userService.fromCookie()};
        if (state.isLoggedIn) {
            goalService.getDefaultGoals();
        }

    } else if (action.type == ActionType.LOG_OUT) {

        state = initialState;

    } else if (action.type == ActionType.LOGIN_FAILED) {

        state = {...state, loginErrors: action.payload};
        console.log(state);

    }

    switch(action.type) {
        case ActionType.ACCOUNT_LOGGEDIN:
            let userWithAuthToken = action.payload;
            userService.updateAxiosHeader(userWithAuthToken.authToken);
            goalService.getDefaultGoals();
            return { ...state, 
                ...userWithAuthToken,
                'isLoggedIn': true
            };

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
        case ActionType.NEXT_ACTION:
            console.log("SettingsReducer: NEXT_ACTION: ");
            console.log(action.payload);
            state = {...state, accountErrors: undefined, ...action.payload};
            break;

        case ActionType.DEFAULT_GOALS_ADDED:
        case ActionType.DEFAULT_GOALS_FETCHED:
            const defaultGoals = action.payload;
            state = {...state, defaultGoals: defaultGoals}
            break;

    }


    return state;
}