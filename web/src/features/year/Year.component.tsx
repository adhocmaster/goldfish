import React, { useState } from 'react';
import ReduxUIComponent from './../../framework/ReduxUIComponent';
import { RootState, store } from './../../app/store';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';

import WeekSummaryComponent from './../week/WeekSummary.component';

export default class YearComponent extends ReduxUIComponent {

    
    getStateFromStore(): any {

        return {
            id: store.getState().yearState.id,
            name: store.getState().yearState.name,
            weeks: store.getState().yearState.weeks,
        }
        
    }

    renderWeekSummary(): any {

        let rows = []
        let numberOfRows = Math.ceil(this.state.weeks.length / 8)

        let weekJsx = []
        for ( let idx in this.state.weeks ) {
            const week = this.state.weeks[idx];
            weekJsx.push(
                <WeekSummaryComponent
                    key={week.id}
                    id={week.id}
                    name={week.name}
                />
            );
        }
        return <Row> {weekJsx} </Row>;
    }

    showWeekForm(): any {
        
        store.dispatch({
            type: 'WEEK_FORM_SHOW'
        });

    }

    hideWeekForm(): any {

        store.dispatch({
            type: 'WEEK_FORM_HIDE'
        });
    }

    addWeek(): any {

    }

    weekForm(): any {

        return (
            <>
                <Button variant='light' onClick={() => this.showWeekForm()}>Add a week</Button>
                <Modal show={this.state.weekFormShow} onHide={() => this.hideWeekForm()}>
                    <Modal.Header closeButton>
                        <Modal.Title>Modal heading</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.hideWeekForm()}>
                        Close
                        </Button>
                        <Button variant="primary" onClick={() => this.addWeek()}>
                        Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }

    // return JSX
    render(): any {
        
        const {id, name} = this.state;
        return (
            <div>
                <Container>
                    <h1>Year: {name} </h1>
                    {this.weekForm()}
                    {this.renderWeekSummary()}
                </Container>
            </div>
        );

    }
}