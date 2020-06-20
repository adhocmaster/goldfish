import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';
import { store } from './app/store';
import { Provider } from 'react-redux';
import * as serviceWorker from './serviceWorker';

store.subscribe(() => console.log("Index subscribe listens to everyone."));

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
