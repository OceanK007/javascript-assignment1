import $ from 'jquery';
import {cardList, card, board} from './view';
import {Service} from './service';
import {CardListService} from './cardlist-service';
import {localhostURL} from './constant';
import {DragNDrop} from './dragndrop';

let service = new Service();

// window.onload
window.onload = function() 
{
    Service.hideCardList()
    service.renderBoards();      // Rendering boards
    console.log(boards);
    Service.addListenerToCardList();    
    Service.addListenersToCardListTitle();
};

// Adding click event for board creation
document.getElementById('board-submit').addEventListener('click', function() {service.addNewBoard(event, this)});

// Adding click event (Won't be executed until you click)
document.getElementById('card-list-name-submit').addEventListener('click', function() {CardListService.addNewCardList(event, this)});

// Adding click event to board link
document.getElementById('board-link').addEventListener('click', function() {Service.goToBoard();})

document.getElementById('modify-title-submit').addEventListener('click', function(){service.modifyTitle(event, this)});

document.getElementById('delete-title-submit').addEventListener('click', function(){service.deleteElement(event, this)});

document.addEventListener("DOMContentLoaded", DragNDrop.init)
