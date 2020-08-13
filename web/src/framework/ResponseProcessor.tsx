class ResponseProcessor {

    public getError(data: any) {

        if ( 'error' in data ) {
            return [ data.error.message ];
        }

        return [];

    } 

    public getHTTPError(error: any) {
        
        let defaultErrors = ["Unprocessed Error"];
                
        if (error.response) {
            /*
            * The request was made and the server responded with a
            * status code that falls out of the range of 2xx
            */
            // console.log(error.response.data);
            // console.log(error.response.status);
            // console.log(error.response.headers);
            let serverError = error.response.data.error;
            let errorMessages: any = null;

            switch (error.response.status) {
                
                case 422:
                    errorMessages = this.get422Error(serverError);
                    break;
                case 401:
                    errorMessages = this.get401Error(serverError);
                    break;
                case 404:
                    errorMessages = this.get404Error(serverError);
                    break;

            }

            if (errorMessages) {
                return errorMessages;
            }

        } else if (error.request) {
            /*
            * The request was made but no response was received, `error.request`
            * is an instance of XMLHttpRequest in the browser and an instance
            * of http.ClientRequest in Node.js
            */
            console.log(error);
            console.log(error.config);
            console.log(error.request);
            return["Couldn't connect to server. Check your connection or the server may be down."];
            // return [];

        } else {
            // Something happened in setting up the request and triggered an Error
            console.log(error);
            console.log('Error', error.message);
            return[error.message];
        }

        return defaultErrors;
        
    }

    private get422Error(data: any) {

        let errors: string[] = [];
        errors.push(data.code);

        for (let serverError of data.details) {

            errors.push(serverError.path + " " + serverError.message);

        }

        return errors;
    }

    private get404Error(data: any) {

        let errors: string[] = [];
        errors.push(data.code);
        errors.push(data.message);

        return errors;

    }

    private get401Error(data: any) {

        return [data.message];

    }
}

export default new ResponseProcessor();