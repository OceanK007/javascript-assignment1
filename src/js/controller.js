import Service from './service';
import { renderBoards, addBoardAction } from './board-service';
import { addListenerToCardList, addListenersToCardListTitle, addCardListAction } from './cardlist-service';
import { DragNDrop } from './dragndrop';
import { store } from './my-redux';

// window.onload
window.onload = function () {
  Service.hideCardList();

  // CALLING RENDER TO FETCH INITIAL STATE
  renderBoards(store.getState());

  addListenerToCardList();
  addListenersToCardListTitle();
};

// Adding click event for board creation
document.getElementById('board-submit').addEventListener('click', () => { addBoardAction(); });

// Adding event for cardlist creation
document.getElementById('card-list-name-submit').addEventListener('click', () => { addCardListAction(); });

// Adding click event to board link
document.getElementById('board-link').addEventListener('click', () => { Service.goToBoard(); });

document.getElementById('modify-title-submit').addEventListener('click', () => { Service.modifyTitle(); });

document.getElementById('delete-title-submit').addEventListener('click', () => { Service.deleteElement(); });

document.addEventListener('DOMContentLoaded', DragNDrop.init);
