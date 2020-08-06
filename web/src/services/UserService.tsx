import axios from 'axios';
import ResponseProcessor from 'framework/ResponseProcessor';
import actionManager from 'framework/ActionManager';
import {ActionType} from 'app/actionTypes';

class UserService {

    constructor() {

    }

    public login(email: string, password:string): [] {

        axios.post("http://localhost:4000/users/login", {

                email: email,
                password: password

            }).then(result => {

                console.log(result);

                // if (result.status === 200) {
                //     // setAuthTokens(result.data);
                //     setLoggedIn(true);
                // } else {
                //     setIsError(true);
                // }

                const errors = ResponseProcessor.getError(result.data);

                if ( errors.length == 0 ) {

                    console.log("got token");
                    let token = result.data.token;
                    actionManager.dispatch(ActionType.ACCOUNT_LOGGEDIN, {'authToken': token}, false)

                } else {

                    actionManager.dispatch(ActionType.LOGIN_FAILED, errors, true);

                }

            }).catch(error => {
                
                const errors = ResponseProcessor.getHTTPError(error);
                actionManager.dispatch(ActionType.LOGIN_FAILED, errors, true);
            }
        );
    }

}

let userService = new UserService();
export default userService;