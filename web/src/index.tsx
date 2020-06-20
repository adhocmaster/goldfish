import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';

import "./assets/scss/paper-dashboard.scss?v=1.2.0";
import "./assets/demo/demo.css";
// import "perfect-scrollbar/css/perfect-scrollbar.css";

import App from './App';
import { store } from './app/store';
import { Provider } from 'react-redux';
import * as serviceWorker from './serviceWorker';

store.subscribe(() => console.log("wtf am I doing with redux"));

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

console.log( store.getState() );

store.dispatch({
  type: 'ADD_USER',
  user: {name: 'Dan'}
});

store.dispatch({
  type: 'VIEW_ITEM',
  item: {id: 'someid', name: 'Item 1'}
});

console.log( store.getState() );
