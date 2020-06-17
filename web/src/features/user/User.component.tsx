import React from 'react';
import {RootState} from './../../app/store';
import { connect } from 'react-redux';



const mapStateToProps = function(state: RootState) {

    return {
        count: state.userState.count,
        users: state.userState.users,
    }
}

class UserComponent {

    constructor() {

    }

    public UserComponent(props: any) {
        return (
            <div id="user-list">
                <h1>Users {props.count}</h1>
                <ul>
                    <li>no user</li>
                </ul>
            </div>
        );
    
    }
    
}

export default connect(mapStateToProps)(new UserComponent().UserComponent);

