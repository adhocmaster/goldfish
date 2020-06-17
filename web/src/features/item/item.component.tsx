import React from 'react';
import { store } from './../../app/store';


export default class ItemComponent extends React.Component {

    state: any;
    unsubscribeStoreHandler:any = null;

    constructor(props: any) {

        super(props);
        this.state = this.getStateFromStore();
    }

    getStateFromStore() {
        return {

            id: store.getState().itemState.id,
            name: store.getState().itemState.name,
        }
    }

    storeListener() {

        const newState = this.getStateFromStore();

        if ( this.state != newState ) {
            this.setState(newState);
        }

    }

    componentDidMount() {
        console.log('mounted an item component');
        let holder = this;
        this.unsubscribeStoreHandler =  store.subscribe(function() {
            holder.storeListener();
        });
    }

    componentWillUnmount() {
        this.unsubscribeStoreHandler();
    }

    
    render() {
        
        const {id, name} = this.state;
        return (
            <div id="itemComponent">
                <h1>{id}</h1>
                <p>{name}</p>
            </div>
        );
    }

}