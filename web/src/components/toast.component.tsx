import React from 'react';
import { RootState, store } from 'app/store';
import Toast from 'react-bootstrap/Toast';

import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useSelector } from 'react-redux';

import GoalModal from 'features/goal/goal.component';
import actionManager from 'framework/ActionManager';
import { WeekActionType } from 'features/week/week.actions';
import toastService from 'app/toast.service';
import Utility from 'framework/Utility';

export default function ToastComponent(props: any) {

    // const toastMessage = toastService.getMessage();
    const toastMessage = Utility.getListRep( toastService.getMessage() );
    let show = false;
    if (toastMessage) {
        show = true;
    }
    return (
        <Toast show={show} onClose={() => toastService.clearMessage()}>
            <Toast.Header>
                <img src="holder.js/20x20?text=%20" className="rounded mr-2" alt="" />
                <strong className="mr-auto">Echo</strong>
                <small>11 mins ago</small>
            </Toast.Header>
            <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
    );

}


export function ToastErrorComponent(props: any) {

    // const toastMessage = toastService.getMessage();
    const toastMessage = Utility.getListRep( toastService.getError() );
    let show = false;
    if (toastMessage) {
        show = true;
    }
    return (
        <Toast show={show} onClose={() => toastService.clearError()}>
            <Toast.Header>
                <img src="holder.js/20x20?text=%20" className="rounded mr-2" alt="" />
                <strong className="mr-auto">Echo</strong>
                <small>11 mins ago</small>
            </Toast.Header>
            <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
    );

}

