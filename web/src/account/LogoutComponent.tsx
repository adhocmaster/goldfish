import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import actionManager from 'framework/ActionManager';
import { ActionType } from 'app/actionTypes';

export default function LogoutComponent(props: any) {

    actionManager.dispatch(ActionType.LOG_OUT);
    return (<Redirect to="/"></Redirect>);

}