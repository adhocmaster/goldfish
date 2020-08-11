
import {YearActionTypes} from 'features/year/year.action';

export default function YearReducer(state: any, action: any) {

    if( state === undefined) {
        state = { 
            id: null,
            name: "No year chosen",
            weeks: [
                {
                    id: 1, 
                    name:'Week 1'
                },
                {
                    id: 2, 
                    name:'Week 1'
                },
                {
                    id: 3, 
                    name:'Week 1'
                },
            ], 
            weekFormShow: false,

        };
    }

    switch(action.type) {

        case YearActionTypes.YEAR_WEEK_FORM_SHOW:
            state = Object.assign({}, state, {weekFormShow: true});
            break;
            
        case YearActionTypes.YEAR_WEEK_FORM_HIDE:
            state = Object.assign({}, state, {weekFormShow: false});
            break;
            

    }

    // console.log(state);

    return state;

}
