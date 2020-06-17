import React from 'react';
import ReduxUIComponent from './../../framework/ReduxUIComponent';
import { RootState, store } from './../../app/store';

export default class CategoryComponent extends ReduxUIComponent {

    
    getStateFromStore(): any {

        return {
            id: store.getState().categoryState.id,
            name: store.getState().categoryState.name,
        }
        
    }

    // return JSX
    render(): any {
        
        const {id, name} = this.state;
        return (
            <div id="itemComponent">
                <h1>{id}</h1>
                <p>{name}</p>
            </div>
        );

    }
}