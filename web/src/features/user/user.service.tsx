import React from 'react';
import axios from 'axios';
import ResponseProcessor from 'framework/ResponseProcessor';
import actionManager from 'framework/ActionManager';
import { ActionType } from 'app/actionTypes';
import { RootState } from 'app/store';
import { shallowEqual, useSelector } from 'react-redux';
import cookies from 'framework/Cookie';
import { Redirect } from 'react-router-dom';

class UserService {

    constructor() {

    }

    public isLoggedIn() {

        return useSelector((state: RootState) => { return state.settingsState.isLoggedIn } );

    }

    public getEmail() {

        return useSelector((state: RootState) => { return state.settingsState.email } );

    }

    public fromCookie() {

        
        this.updateAxiosHeader(cookies.get('authToken'));

        return  {
            'authToken': cookies.get('authToken'),
            'email': cookies.get('email'),
            'isLoggedIn': cookies.get('isLoggedIn')
        };

    }

    public getLoginPage() {
        
        return (<Redirect to="/login"></Redirect>);
        
    }


    public login(email: string, password:string) {

        axios.post("http://localhost:4000/users/login", {

                email: email,
                password: password

            }).then(result => {

                // console.log(result);

                const errors = ResponseProcessor.getError(result.data);

                if ( errors.length == 0 ) {

                    console.log("got token");
                    let token = result.data.token;
                    cookies.set('authToken', token, {'path': '/', 'maxAge': 3600*24*7});
                    cookies.set('email', email, {'path': '/', 'maxAge': 3600*24*7});
                    cookies.set('isLoggedIn', true, {'path': '/', 'maxAge': 3600*24*7});

                    this.updateAxiosHeader(token);
                    actionManager.dispatch(ActionType.ACCOUNT_LOGGEDIN, {'authToken': token, 'email': email}, false);


                } else {

                    actionManager.dispatch(ActionType.LOGIN_FAILED, errors, true);

                }

            }).catch(error => {
                
                const errors = ResponseProcessor.getHTTPError(error);
                actionManager.dispatch(ActionType.LOGIN_FAILED, errors, true);
            }
        );
    }

    public logout() {
        this.removeFromCookie();
        this.updateAxiosHeader(undefined);
        actionManager.dispatch(ActionType.LOG_OUT);
    }

    private removeFromCookie() {

        cookies.remove('authToken');
        cookies.remove('email');
        cookies.remove('isLoggedIn');

    }

    private updateAxiosHeader(token: string | undefined) {

        if (token) {

            axios.interceptors.request.use(req => {
                req.headers.authorization = `Bearer ${token}`;
                return req;
              });
        } else {
            
            axios.interceptors.request.use(req => {
                req.headers.authorization = "";
                return req;
            });
        }

    }



}

let userService = new UserService();
export default userService;