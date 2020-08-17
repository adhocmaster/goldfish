import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import actionManager from 'framework/ActionManager';
import { ActionType } from 'app/actionTypes';
import userService from 'features/user/user.service';

export default function LogoutComponent(props: any) {

    userService.logout();
    return (<Redirect to="/login"></Redirect>);

}