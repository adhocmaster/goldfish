import React from 'react';
import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import NavComponent from './app/nav.component';
import LoginComponent from './account/login.component';
import LogoutComponent from './account/logout.component';
import SettingsComponent from 'account/settings.component';
import YearComponent from './features/year/year.component';
import WeekComponent from 'features/week/week.component';
import userService from 'features/user/user.service';
import ToastComponent, { ToastErrorComponent } from 'app/toast.component';
import SignupComponent from 'account/signup.component';
import AccountWizardComponent from 'account/accountWizard.component';


function App() {
  return (
    <Router>
      <div className="App">
        <NavComponent />
        <Switch>
          <Route path="/login">
            <LoginComponent />
          </Route>
          <Route path="/signup">
            <SignupComponent  />
          </Route>
          <Route path="/account-wizard">
            <AccountWizardComponent  />
          </Route>
          {/* {
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

              </>
          } */}
          <Route path="/week">
            <WeekComponent />
          </Route>
          <Route path="/settings">
            <SettingsComponent />
          </Route>
          <Route path="/logout">
            <LogoutComponent />
          </Route>
          <Route path="/">
            <YearComponent />
          </Route>
        </Switch>
        <ToastComponent />
        <ToastErrorComponent />
      </div>
    </Router>
  );
}

export default App;
