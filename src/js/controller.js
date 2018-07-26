import {Service} from './service';
import {BoardService} from './board-service';
import {CardListService} from './cardlist-service';
import {DragNDrop} from './dragndrop';
import {store} from './my-redux';

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
//document.getElementById('card-list-name-submit').addEventListener('click', function() {CardListService.addNewCardList(event, this)});

// Adding click event to board link
document.getElementById('board-link').addEventListener('click', function() {Service.goToBoard();})

document.getElementById('modify-title-submit').addEventListener('click', function(){service.modifyTitle(event, this)});

document.getElementById('delete-title-submit').addEventListener('click', function(){service.deleteElement(event, this)});

document.addEventListener("DOMContentLoaded", DragNDrop.init);
