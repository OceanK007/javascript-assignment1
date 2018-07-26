import {Service} from './service';
import {renderBoards,saveBoard, addBoardAction} from './board-service';
import {addListenerToCardList, addListenersToCardListTitle, saveCardList, addCardListAction} from './cardlist-service';
import {DragNDrop} from './dragndrop';
import {store} from './my-redux';

let service = new Service();
// window.onload
window.onload = function() 
{
    Service.hideCardList()

    // CALLING RENDER TO FETCH INITIAL STATE
    renderBoards(store.getState());      

    addListenerToCardList();    
    addListenersToCardListTitle();
};

// Adding click event for board creation
document.getElementById('board-submit').addEventListener('click', function() { addBoardAction();});

// Adding event for cardlist creation
document.getElementById('card-list-name-submit').addEventListener('click', function() { addCardListAction(); });

// Adding click event to board link
document.getElementById('board-link').addEventListener('click', function() {Service.goToBoard();})

document.getElementById('modify-title-submit').addEventListener('click', function(){service.modifyTitle(event, this)});

document.getElementById('delete-title-submit').addEventListener('click', function(){service.deleteElement(event, this)});

document.addEventListener("DOMContentLoaded", DragNDrop.init);
