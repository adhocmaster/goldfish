import React from 'react';
import axios from 'axios';
import ResponseProcessor from 'framework/ResponseProcessor';
import actionManager from 'framework/ActionManager';
import { ActionType } from 'app/actionTypes';
import { RootState } from 'app/store';
import { shallowEqual, useSelector } from 'react-redux';
import cookies from 'framework/Cookie';
import { Redirect } from 'react-router-dom';
import config from 'framework/Configuration';
import toastService from 'app/toast.service';

class UserService {

    serviceUrl = config.getBackend() + "/users";

    constructor() {

    }
    
    private handleDataError(errors: any[]) {
        actionManager.dispatch(ActionType.ACCOUNT_ERROR, errors, true);
        toastService.error(errors);

    }

    private handleHttpError(error: any) {
        const errors = ResponseProcessor.getHTTPError(error);
        actionManager.dispatch(ActionType.ACCOUNT_ERROR, errors, true);
        toastService.error(errors);
    }

    public isLoggedIn() {

        return useSelector((state: RootState) => { return state.settingsState.isLoggedIn } );

    }

    public getEmail() {

        return useSelector((state: RootState) => { return state.settingsState.email } );

    }

    public fromCookie() {


        const userInfo = cookies.get("userInfo");

        if (!userInfo) {
            return {'isLoggedIn': false};
        }
        this.updateAxiosHeader(userInfo.authToken);

        let state =  {
            'isLoggedIn': cookies.get('isLoggedIn')
        };

        state = {...state, ...userInfo}

        return state;

    }

    public getLoginPage() {
        
        return (<Redirect to="/login"></Redirect>);
        
    }


    public login(email: string, password:string) {

        axios.post(
            this.serviceUrl + "/login", {

                email: email,
                password: password

            }).then(result => {

                // console.log(result);

                const errors = ResponseProcessor.getError(result.data);

                if ( errors.length == 0 ) {

                    console.log("got token");
                    let userWithAuthToken = result.data;
                    let token = userWithAuthToken.authToken;
                    cookies.set('userInfo', userWithAuthToken, {'path': '/', 'maxAge': 3600*24*7});
                    cookies.set('isLoggedIn', true, {'path': '/', 'maxAge': 3600*24*7});

                    this.updateAxiosHeader(token);
                    actionManager.dispatch(ActionType.ACCOUNT_LOGGEDIN, userWithAuthToken, false);


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

        cookies.remove('userInfo');
        cookies.remove('isLoggedIn');

    }

    public updateAxiosHeader(token: string | undefined) {

        console.log("setting axios header to token: " + token);
        if (token !== undefined) {

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



    public signup(name: string, email: string, password:string) {

        axios.post(
            this.serviceUrl + "/signup", {

                name: name,
                email: email,
                password: password

            }).then(response => {

                // console.log(result);

                const errors = ResponseProcessor.getError(response.data);

                if ( errors.length == 0 ) {

                    console.log("USER CREATED");
                    actionManager.dispatch(ActionType.ACCOUNT_CREATED, response.data);


                } else {

                    this.handleDataError(errors);

                }

            }).catch(error => {
            
                this.handleHttpError(error);
            }
        );
    }

    public nextAction() {

        axios.post(
            this.serviceUrl + "/next-action",
            {},
        ).then(response => {


            const errors = ResponseProcessor.getError(response.data);

            if ( errors.length == 0 ) {

                actionManager.dispatch(ActionType.NEXT_ACTION, response.data);


            } else {

                this.handleDataError(errors);

            }

        }).catch(error => {
        
            this.handleHttpError(error);
        }
    );
    }


}

let userService = new UserService();
export default userService;