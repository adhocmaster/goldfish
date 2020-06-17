export default function ItermReducer(state: any, action: any) {

    if( state === undefined ) {
        
        return {
            id: null,
            name: null,

        }
    }

    if ( action.type == 'VIEW_ITEM' ) {

        return Object.assign( {}, state, action.item );

    }

    return state;

}