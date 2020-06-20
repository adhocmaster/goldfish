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

    if(action.type === 'VIEW_YEAR') {
        
        // const weeks = state.weeks.slice(); // copy elements
        // users.push(action.user);
        // const count = state.count + 1;

        // return Object.assign({}, state, { users: users, count: count } )

    }

    return state;

}
