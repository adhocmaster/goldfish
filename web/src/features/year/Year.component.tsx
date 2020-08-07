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
import YearReducer from 'features/year/year.reducer';
import yearService from 'features/year/year.service';

import WeekSummaryComponent from './../week/WeekSummary.component';
import actionManager from 'framework/ActionManager';
import {YearActionTypes} from 'features/year/year.action';

export default class YearComponent extends ReduxUIComponent {

    constructor(props: any) {
        super(props);
    }

    
    getStateFromStore(): any {

        return store.getState().yearState;
        
    }

    renderWeekSummary(): any {

        let date: Date = new Date();  
        let weeks = yearService.getWeekDates(date.getFullYear());
        console.log(weeks);
        
        let rows = []
        let numberOfRows = Math.ceil(this.state.weeks.length / 8)

        let weekJsx = []
        // for ( let idx in this.state.weeks ) {
        //     const week = this.state.weeks[idx];
        //     weekJsx.push(
        //         <WeekSummaryComponent
        //             key={week.id}
        //             id={week.id}
        //             name={week.name}
        //         />
        //     );
        // }
        
        for ( let idx in weeks ) {
            const week = weeks[idx];
            weekJsx.push(
                <WeekSummaryComponent
                    no={idx}
                    start={week.start}
                    end={week.end}
                    name={week.name}
                />
            );
        }
        return <Row> {weekJsx} </Row>;
    }

    showWeekForm(): any {
        
        actionManager.dispatch(YearActionTypes.YEAR_WEEK_FORM_SHOW);

    }

    hideWeekForm(): any {

        actionManager.dispatch(YearActionTypes.YEAR_WEEK_FORM_HIDE);

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
        
        let date: Date = new Date();  
        // date.setDate(13);  
        // date.setMonth(13);  
        // date.setFullYear(2013);  
        // date.setHours(13);  
        // date.setMinutes(13);  
        // date.setSeconds(13);  
        // console.log("Year = " + date.getFullYear());  
        // console.log("toDateString = " + date.toDateString());  
        // console.log("toLocaleDateString = " + date.toLocaleDateString());  
        // console.log("toString = " + date.toString());  
        // console.log("toTimeString = " + date.toTimeString());  
        // console.log("toISOString() = " + date.toISOString());  



        const {id, name} = this.state;
        return (
            <div>
                <Container>
                    <h1>Year: {date.getFullYear()} </h1>
                    {this.weekForm()}
                    {this.renderWeekSummary()}
                    {

                    }
                </Container>
            </div>
        );

    }
}