import {Service} from './service';
import {BoardService} from './board-service';
import {CardListService} from './cardlist-service';
import {DragNDrop} from './dragndrop';
import {createStore} from 'redux';

let service = new Service();

// window.onload
window.onload = function() 
{
    Service.hideCardList()

    // CALLING RENDER TO FETCH INITIAL STATE
    BoardService.renderBoards(store.getState());      

    CardListService.addListenerToCardList();    
    CardListService.addListenersToCardListTitle();
};

// Adding click event for board creation
document.getElementById('board-submit').addEventListener('click', function() 
{
    var lastBoardId = Service.getLastElementId();
    let boardTitleRef = document.getElementById("board-input");
    
    if(boardTitleRef.value == "")
    {
        alert("Please provide Board title");
    }
    else
    {            
        var newState = {id:Number(lastBoardId)+1, title:boardTitleRef.value, isActive:true, cardList:[]};
        // ACTIONS
        store.dispatch({type: 'ADD_BOARD', details: newState});
        // DB CALL
        BoardService.saveBoard(newState);
    }   
    
    boardTitleRef.value = "";
});

// Adding click event (Won't be executed until you click)
document.getElementById('card-list-name-submit').addEventListener('click', function() {CardListService.addNewCardList(event, this)});

// Adding click event to board link
document.getElementById('board-link').addEventListener('click', function() {Service.goToBoard();})

document.getElementById('modify-title-submit').addEventListener('click', function(){service.modifyTitle(event, this)});

document.getElementById('delete-title-submit').addEventListener('click', function(){service.deleteElement(event, this)});

document.addEventListener("DOMContentLoaded", DragNDrop.init);

// STATE
var state = BoardService.getBoards();
console.log(state);

// STATE ARRAY (FOR UNDO OPERATIONS)
var stateArray = [];

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

// STORE
var store = createStore(reducer, state);

// SUBSCRIBING to STORE
store.subscribe(render);    // Subscribing, so if state changes, it automatically renders on html
function render()
{
    console.log("In Render: "+store.getState());   
    BoardService.renderBoards(store.getState());
}