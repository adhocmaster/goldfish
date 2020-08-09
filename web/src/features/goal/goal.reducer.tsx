export default function GoalReducer(state: any, action: any) {

    if( state === undefined) {
        state = { 
            categories
            : [], 
            count: 0
        };
    }

    if(action.type === 'VIEW_CATEGORY') {
        
        const users = state.users.slice(); // copy elements
        users.push(action.user);
        const count = state.count + 1;

        return Object.assign({}, state, { users: users, count: count } )

    }

    return state;

}
