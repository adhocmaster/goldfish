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

        console.log(newState);
        console.log(this.state);

        if ( deepEqual( this.state, newState ) ) {

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