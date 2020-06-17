export default function userReducer(state: any, action: any) {

    if( state === undefined) {
        state = { 
            users: [], 
            count: 0
        };
    }

    if(action.type === 'ADD_USER') {
        
        const users = state.users.slice(); // copy elements
        users.push(action.user);
        const count = state.count + 1;

        return Object.assign({}, state, { users: users, count: count } )

    }

    return state;

}
