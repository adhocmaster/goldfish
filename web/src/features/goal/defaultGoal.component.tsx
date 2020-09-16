import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import toastService from 'app/toast.service';
import deepEqual from 'deep-equal';
import userService from 'features/user/user.service';
import Utility from 'framework/Utility';
import React, { useEffect, useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { CirclePicker } from 'react-color';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import goalService from './goal.service';




export default function DefaultGoalComponent(props: any): any {
    
    const defaultColor = "#444444";
    // Goal states
    const [errors, setErrors] = useState<string[]>([]);
    const [titlesWithColors, setTitlesWithColors] = useState<{title: string, color: string, id: string|undefined}[]>([]);
    const [newTitle, setNewTitle] = useState<string>("");
    const [newColor, setNewColor] = useState<string>(defaultColor);

    const defaultGoals = useSelector((state: RootState) => { return state.settingsState.defaultGoals });

    

    useEffect(() => {

        console.log("DefaultGoalComponent: initializing with default Goals!");
        if (defaultGoals) {

            let defaultTitlesWithColors = []
            for (let goal of defaultGoals) {
                defaultTitlesWithColors.push({title: goal.title, color: goal.color, id: goal.id});
            }

            if (! deepEqual(titlesWithColors, defaultTitlesWithColors)) {

                // defaultTitlesWithColors = [...defaultTitlesWithColors, ...titlesWithColors];
                setTitlesWithColors(defaultTitlesWithColors);
            }
        }

    });

    console.log(titlesWithColors);

    return (
        <Container className="login-container" >
            <Row className="justify-content-md-center">
                App wizard
                <Card id="default-goal-form" style={{ width: '18rem', margin: "10px" }}>
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
                                    color: newColor, 
                                    id: undefined
                    
                                }]);
                            }}>
                                ADD
                        </Button>
                    </Card.Footer>
                </Card>
                
                
                <Card id="default-goal-list" style={{ width: '18rem', margin: "10px" }}>
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
                        <Button value={index} variant="light"  size='sm'  className='float-right'
                            onClick={(e: any) => {
                                // console.log(e.currentTarget);
                                removeGoal(e.currentTarget.value);
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
        let removedTitleWithColor = clonedTitles[index];
        console.log("DefaultGoalcomponent: removing at index: " + index);
        console.log(removedTitleWithColor);
        if (removedTitleWithColor.id) {
            goalService.removeDefaultGoalById(removedTitleWithColor.id);
        }
        clonedTitles.splice(index, 1);
        setTitlesWithColors(clonedTitles);
    }
    
}