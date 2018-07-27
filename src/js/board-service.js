import $ from 'jquery';
import { board } from './view';
import Service from './service';
import { renderCardList } from './cardlist-service';
import { getData, saveUpdateData } from './dbcalls';
import { boardsURL, boardPrefix } from './constant';
import { store } from './my-redux';

export function getBoard(url) {
  return getData(url);
}

export function saveBoard(data) {
  saveUpdateData(boardsURL, data, 'POST');
}

export function addBoardAction() {
  const lastBoardId = Service.getLastBoardId();
  const boardTitleRef = document.getElementById('board-input');

  if (boardTitleRef.value === '') {
    alert('Please provide Board title');
  } else {
    const newBoardState = { id: Number(lastBoardId) + 1, title: boardTitleRef.value, isActive: true };

    // ACTIONS
    store.dispatch({ type: 'ADD_BOARD', details: newBoardState });

    // DB CALL
    saveBoard(newBoardState);
  }

  boardTitleRef.value = '';
}

// START: Setting board information //
export function settingBoardInfo(e) {
  Service.boardId = e.target.id.substring(boardPrefix.length); // Will automatically call setter
  Service.boardTitle = e.target.textContent; // Will automatically call setter
  // console.log(Service.boardId);
  // console.log(Service.boardTitle);
}
// END: Setting board information //

// START: Adding listener to boards //
export function addListenersToBoards() {
  const boardList = document.getElementsByClassName('board');
  // console.log(cardListTitles);

  // Or use this iteration (ES6)
  Array.from(boardList).forEach((element) => {
    // console.log(element);
    if (element.getAttribute('clickcount') == null) {
      element.setAttribute('clickcount', '1');
      element.addEventListener('click', (event) => {
        Service.hideBoards();
        Service.showCardList();
        settingBoardInfo(event);

        renderCardList(store.getState());
      });
    }
  });
}
// END: Adding listener to boards //

// START: Rendering board //
export function renderBoards(state) {
  // var boards = getBoards();   // DB call
  const boardContainer = document.getElementById('boards');

  // Delete all element except last element
  Service.deletePreviousSiblings(document.getElementById('board-create'));

  $.each(state.boards, (key, val) => {
    if (val.isActive === true) {
      // console.log("id: "+val.id+", title: "+val.title);
      const boardCreate = document.getElementById('board-create');
      const boardFragment = document.createRange().createContextualFragment(board);
      // boardFragment.querySelector('.board').setAttribute("href", "board.html");
      boardFragment.querySelector('.board').id = boardPrefix + val.id;
      boardFragment.querySelector('.board').textContent = val.title;
      boardContainer.insertBefore(boardFragment, boardCreate);
    }
  });

  addListenersToBoards();
}
// END: Rendering board //

// START: Adding new board //
// static addNewBoard(e, ref)
// {
//     let boardName = document.getElementById("board-input");
//     let boardContainer = document.getElementById("boards");
//     let boardCreate = document.getElementById('board-create');
//     let lastBoardId = 0;
//     if(boardContainer.lastElementChild.previousElementSibling != null)
//     {
//         lastBoardId = boardContainer.lastElementChild.previousElementSibling.id;
//     }

//     let boardFragment = document.createRange().createContextualFragment(board);
//     boardFragment.querySelector('.board').textContent = boardName.value;
//     boardFragment.querySelector('.board').id = Number(lastBoardId)+1;

//     boardContainer.insertBefore(boardFragment, boardCreate);

//     BoardService.addListenersToBoards();

//     BoardService.fetchAndSaveBoardToDB(Number(lastBoardId)+1, boardName.value);

//     // Cleaning input value
//     boardName.value = "";
// }
// END: Adding new board //

// START: Saving board to DB //
// static fetchAndSaveBoardToDB(id, title)
// {
//     var arr = new Array();
//     var newBoard = {"id":id, "title":title, "cardList":arr};
//     //console.log(id);
//     //console.log(title);

//     saveDataUsingURL("boards", newBoard, "POST");
// }
// END: Saving board to DB //
