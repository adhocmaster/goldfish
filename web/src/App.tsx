import React from 'react';
import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import NavComponent from './components/NavComponent';
import LoginComponent from './account/LoginComponent';
import LogoutComponent from './account/LogoutComponent';
import SettingsComponent from 'account/settings.component';
import YearComponent from './features/year/year.component';
import WeekComponent from 'features/week/week.component';
import userService from 'features/user/user.service';
import ToastComponent from 'components/toast.component';


function App() {
  return (
    <Router>
      <div className="App">
        <NavComponent />
        <Switch>
          <Route path="/login">
            <LoginComponent />
          </Route>
          {
              userService.isLoggedIn() &&
              <>
                <Route path="/week">
                  <WeekComponent />
                </Route>
                <Route path="/settings">
                  <SettingsComponent />
                </Route>
                <Route path="/logout">
                  <LogoutComponent />
                </Route>
                <Route path="/year">
                  <YearComponent />
                </Route>
              </>
          }
          <Route path="/">
            <YearComponent />
          </Route>
        </Switch>
        <ToastComponent />
      </div>
    </Router>
  );
}

export default App;
