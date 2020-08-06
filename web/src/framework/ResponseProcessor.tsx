import { Fragment } from "react";

class ResponseProcessor {

    public getError(response: any) {

        if ( 'error' in response ) {
            return { message: response.error.message };
        }

        return false;
        


    } 

    public getHTTPError(error: any) {
        
        let defaultErrors = ["Unknown Error"];
                
        if (error.response) {
            /*
            * The request was made and the server responded with a
            * status code that falls out of the range of 2xx
            */
            // console.log(error.response.data);
            // console.log(error.response.status);
            // console.log(error.response.headers);

            let errorMessages = this.get422Error((error.response))

            if (errorMessages) {
                return errorMessages;
            }

        } else if (error.request) {
            /*
            * The request was made but no response was received, `error.request`
            * is an instance of XMLHttpRequest in the browser and an instance
            * of http.ClientRequest in Node.js
            */
            console.log(error.request);
        } else {
            // Something happened in setting up the request and triggered an Error
            console.log('Error', error.message);
        }
        console.log(error.config);
        console.log(error);

        return defaultErrors;
        
    }

    private get422Error(errorResponse: any) {

        console.log(errorResponse)

        if (errorResponse.status != 422) {
            return false;
        }

        let data = errorResponse.data.error;
        let details = data.details;

        let errors: string[] = [];
        errors.push(data.code)

        for (let serverError of data.details) {

            errors.push(serverError.path + " " + serverError.message)

        }

        return errors;


    }
}

export default new ResponseProcessor();