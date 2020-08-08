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
import { Link } from 'react-router-dom';


export default function WeekSummaryComponent(props: any) {

    return (
        
        <Card style={{ width: '12rem', margin: '5px' }}>
            <Card.Header className='card-small-header link-gray'>
                <Link className='link-gray' to='/week'>
                    Week {props.no} 
                    <small>{props.start.toLocaleDateString()} - {props.end.toLocaleDateString()}</small>
                </Link>
            </Card.Header>
            <Card.Body>
                {
                    props.name &&
                    <Card.Title>{props.name}</Card.Title>
                }
                {
                    props.summary &&
                    <Card.Text>{props.summary}</Card.Text>
                }
                <Badge pill variant='info'>100</Badge>
            </Card.Body>
        </Card>
    );

}