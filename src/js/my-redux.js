import {createStore} from 'redux';
import {BoardService} from './board-service';

// STATE ARRAY (FOR UNDO OPERATIONS)
let stateArray = [];

// STATE
let state = BoardService.getBoards();
console.log(state);

// STORE
export let store = createStore(reducer, state);

// SUBSCRIBING to STORE
store.subscribe(render);    // Subscribing, so if state changes, it automatically renders on html

function render()
{
    console.log("In Render: "+store.getState());   
    BoardService.renderBoards(store.getState());
}

// REDUCER
function reducer(state, action)
{
    //console.log(stateArray);
    //console.log(state);
    //console.log(action);
    // Never override the current state, it will be required for undo operations
    switch(action.type)
    {
        case 'ADD_BOARD':
            console.log("ADD_BOARD");
            return addBoardReducer(state, action);

        case 'REMOVE_BOARD':            
            console.log("REMOVE_BOARD");
            return removeBoardReducer(state, action);
        default:
            return state;
    }
}

// ADD_BOARD REDUCER
function addBoardReducer(state, action)
{
    console.log(state);
    if(state == null)
    {
        stateArray.push(state);
        return [
                {
                    "id":action.details.id,
                    "title":action.details.title,
                    "isActive":action.details.isActive,
                    "cardList":[]
                }
            ];
    }
    else
    {
        stateArray.push(state);
        return [
                ...state, 
                {
                    "id":action.details.id,
                    "title":action.details.title,
                    "isActive":action.details.isActive,
                    "cardList":[]
                }
            ]
    }
}

// REMOVE_BOARD REDUCER
function removeBoardReducer(state, action)
{
    return state;
}