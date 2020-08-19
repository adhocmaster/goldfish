import { faCheckSquare, faList, faPlusCircle, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import toastService from 'app/toast.service';
import deepEqual from 'deep-equal';
import Utility from 'framework/Utility';
import React, { createRef, useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { shallowEqual, useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import goalService from './goal.service';
import TaskComponent from './task.component';
import weekService from 'features/week/week.service';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Alert from 'react-bootstrap/Alert';
import userService from 'features/user/user.service';
import { SketchPicker, CirclePicker } from 'react-color';




export default function DefaultGoalComponent(props: any): any {
    
    const defaultColor = "#444444";
    // Goal states
    const [errors, setErrors] = useState<string[]>([]);
    const [titlesWithColors, setTitlesWithColors] = useState<{title: string, color: string}[]>([]);
    const [newTitle, setNewTitle] = useState<string>("");
    const [newColor, setNewColor] = useState<string>(defaultColor);


    return (
        <Container className="login-container" >
            <Row className="justify-content-md-center">
                App wizard
                <Card style={{ width: '18rem', margin: "10px" }}>
                    <Card.Body>
                        <Card.Title>Add a few goals</Card.Title>
                        <Form.Group>
                            <Form.Label>Title:</Form.Label>
                            <Form.Control type="text"
                                value={newTitle}
                                onChange={e => {
                                    if (e.target.value.split(" ").length > 3) {
                                        toastService.error("Goal is too long. Make it short? " + e.target.value.length);
                                        setErrors([`3 words per goal!
                                        Make it short? Example: Guitar instead of Learn Guitar`]);
                                    } else {
                                        setErrors([]);
                                        setNewTitle(e.target.value);
                                    }
                                }} />
                            <Form.Text className="text-muted">Keep it one or two words.
                            </Form.Text>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Color:</Form.Label>
                            <CirclePicker
                                color={ newColor }
                                onChangeComplete={(color: any) => {
                                    setNewColor(color.hex);
                                }}
                            />

                        </Form.Group>

                        <br/>
                        <div>
                            {errors.length > 0 && 
                                <Alert variant="warning">
                                    {Utility.getListRep(errors)}
                                </Alert>
                            }
                        </div>
                    </Card.Body>
                    <Card.Footer>
                    
                        <Button size='sm'  variant="primary" type="submit" onClick={(e: any) => {
                                setTitlesWithColors([...titlesWithColors, {
                                    title: newTitle,
                                    color: newColor
                                }]);
                            }}>
                                ADD
                        </Button>
                    </Card.Footer>
                </Card>
                <Card style={{ width: '18rem', margin: "10px" }}>
                    <Card.Body>
                        {getGoalCards()}
                    </Card.Body>
                    <Card.Footer className="d-flex justify-content-center">
                        
                        <Button variant="success" size='sm' 
                            onClick={(e: any) => {
                                goalService.createDefaultGoals(titlesWithColors);
                            }}
                        >
                            UPDATE GOALS
                        </Button>
                        &nbsp;
                        <Button variant="secondary" size='sm' 
                            onClick={(e: any) => {
                                userService.nextAction();
                            }}
                        >
                            SKIP
                        </Button>
                    </Card.Footer>
                </Card>
            </Row>
        </Container>
    );

    

    function getGoalCards() {

        let cards = []

        let index = -1;
        for(let goal of titlesWithColors) {
            ++index;
            let color = goal.color;

            cards.push(
                <Card className={`task-card`} key={`goal-${index}`}>
                    <Card.Body>
                        <Button variant="light"  size='sm'  className='float-right'
                            onClick={(e: any) => {
                                removeGoal(index);
                            }}
                        > 
                            <FontAwesomeIcon icon={faTimes} color={"#bbbbbb"} />
                        </Button>
                        <div className='d-flex align-items-center' onClick={(e: any) => {toastService.message("No editing. Just delete and add again.")}}>
                            <div style={{width:"2em", height:"2em", backgroundColor:`${color}`}}>

                            </div>
                            &nbsp; {goal.title}
                        </div>
                    </Card.Body>
                </Card>
            );

            
        }

        return cards;
        
    }

    function removeGoal(index: number) {
        let clonedTitles = [...titlesWithColors];
        clonedTitles.splice(index, 1);
        setTitlesWithColors(clonedTitles);
    }
    
}