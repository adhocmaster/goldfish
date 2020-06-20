import React from 'react';
import logo from './logo.svg';
import { Counter } from './features/counter/Counter';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import NavComponent from './components/NavComponent'
import LoginComponent from './components/LoginComponent'
import UserComponent from './features/user/User.component'
import ItemComponent from './features/item/item.component'
import YearComponent from './features/year/Year.component'

function App() {
  return (
    <div className="App">
      <NavComponent />
      <YearComponent />
    </div>
  );
}

export default App;
