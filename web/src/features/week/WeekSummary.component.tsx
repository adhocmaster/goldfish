import React from 'react';
import ReduxUIComponent from './../../framework/ReduxUIComponent';
import { RootState, store } from './../../app/store';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';


export default function WeekSummaryComponent(props: any) {

    return (
        
        <Card style={{ width: '12rem', margin: '5px' }}>
            <Card.Body>
                <Card.Title>{props.name}</Card.Title>
                <Card.Text>This is a week</Card.Text>
            </Card.Body>
        </Card>
    );

}