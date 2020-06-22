import React from 'react';
import { RootState, store } from './../app/store';
import deepEqual from 'deep-equal';


export default abstract class ReduxUIComponent extends React.Component {

    public state: any;
    unsubscribeStoreHandler:any = null;

    constructor(props: any) {

        super(props);
        this.state = this.getStateFromStore();
        
    }

    // something like this: 
    // return {
    //     name: store.getState().itemState.name,
    // }
    abstract getStateFromStore(): any;

    // return JSX
    abstract render(): any;

    // This listener is attached to the store events
    storeListener() {

        const newState = this.getStateFromStore();

        console.log(`listener class : ${this.constructor.name}`);
        console.log('new state:');
        console.log(newState);
        console.log('old state:');
        console.log(this.state);

        if ( !deepEqual( this.state, newState ) ) {

            console.log('states are not equal. So updating');

            this.setState(newState);

        }

    }

    componentDidMount() {
        // console.log('mounted an item component');
        let holder = this;
        this.unsubscribeStoreHandler =  store.subscribe(function() {
            holder.storeListener();
        });
    }

    componentWillUnmount() {
        this.unsubscribeStoreHandler();
    }

}