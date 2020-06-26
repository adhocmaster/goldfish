import React from 'react';
import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import NavComponent from './components/NavComponent'
import LoginComponent from './account/LoginComponent'
import UserComponent from './features/user/User.component'
import ItemComponent from './features/item/item.component'
import YearComponent from './features/year/Year.component'
import SettingsComponent from 'account/settings.component';


function App() {
  return (
    <Router>
      <div className="App">
        <NavComponent />
        <Switch>
          <Route path="/settings">
            <SettingsComponent />
          </Route>
          <Route path="/">
            <YearComponent />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
