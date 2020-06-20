export default function WeekSummaryReducer(state: any, action: any) {

    if( state === undefined) {
        state = { 
            id: null,
            name: "Week 1",
            dateStart: '06/21/2020',
            days: 0
        };
    }

    if(action.type === 'VIEW_YEAR') {
        
        // const weeks = state.weeks.slice(); // copy elements
        // users.push(action.user);
        // const count = state.count + 1;

        // return Object.assign({}, state, { users: users, count: count } )

    }

    return state;

}
