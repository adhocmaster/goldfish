import React from 'react';
import ReduxUIComponent from '../../framework/ReduxUIComponent';
import { RootState, store } from '../../app/store';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import Alert from 'react-bootstrap/ProgressBar';
import ProgressBar from 'react-bootstrap/ProgressBar';
import FormControl from 'react-bootstrap/FormControl';
import Modal from 'react-bootstrap/Modal';

import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import actionManager from 'framework/ActionManager';
import { WeekActionType } from 'features/week/week.actions';
import weekService from 'features/week/week.service';

export default function GoalModal(props: any): any {

    const showGoalModal = useSelector( (state:RootState) => { return state.weekState.showGoalModal } )

    function hide() {

        actionManager.dispatch(WeekActionType.HIDE_GOAL_FORM);

    }

    function submit() {

        //  user service to submit. dispatch actions based on the result.
        // actionManager.dispatch(WeekActionType.SUBMIT_GOAL_FORM);

        weekService.createGoal(null);

    }

    function onHide() {
        
        actionManager.dispatch(WeekActionType.HIDE_GOAL_FORM);

    }

    return (
        <>
            <Modal show={showGoalModal} onHide={() => onHide()}>
                <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => hide()}>
                    Close
                    </Button>
                    <Button variant="primary" onClick={() => submit()}>
                    Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}