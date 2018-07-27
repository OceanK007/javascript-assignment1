import { createStore } from 'redux';
import { renderBoards } from './board-service';
import { fullDataURL } from './constant';
import { renderCardList } from './cardlist-service';
import { renderCard } from './card-service';
import { getData } from './dbcalls';

// STATE ARRAY (FOR UNDO OPERATIONS)
// const stateArray = [];

// STATE
export let state = {};
const stateData = getData(fullDataURL);
if (stateData != null)
{
  state = { ...stateData };
}
// console.log(state);

// STORE
export const store = createStore(reducer, state);
// console.log(store.getState());

// SUBSCRIBING to STORE
store.subscribe(render); // Subscribing, so if state changes, it automatically renders on html

function render() {
  // console.log(`In Render: ${store.getState()}`);
  // console.log("In Render: "+store.getState().boards);

  // Rendering boards
  renderBoards(store.getState());

  // Rendering cardlist
  renderCardList(store.getState());

  // Rendering cards
  renderCard(store.getState());
}

// REDUCER
function reducer(state, action) {
  // console.log(stateArray);
  // console.log(state);
  // console.log(action);
  // Never override the current state, it will be required for undo operations
  switch (action.type) {
    case 'ADD_BOARD':
      // console.log('ADD_BOARD');
      return addBoardReducer(state, action);

    // case 'REMOVE_BOARD':
    //   // console.log('REMOVE_BOARD');
    //   return removeBoardReducer(state, action);

    case 'ADD_CARD_LIST':
      // console.log('ADD_CARD_LIST');
      return addCardListReducer(state, action);

    case 'ADD_CARD':
      // console.log('ADD_CARD');
      return addCardReducer(state, action);

    default:
      return state;
  }
}

// ADD_BOARD REDUCER
function addBoardReducer(state, action) {
  // console.log(state);
  // stateArray.push(state);

  const newState = { ...state };
  const newBoard = {
    id: action.details.id,
    title: action.details.title,
    isActive: action.details.isActive,
  };

  newState.boards.push(newBoard);

  // console.log(newState);

  return newState;
}

// REMOVE_BOARD REDUCER
// function removeBoardReducer(state, action) {
//   // console.log(action);
//   return state;
// }

// ADD_CARD_LIST REDUCER
function addCardListReducer(state, action) {
  // console.log(state);
  // stateArray.push(state);

  const newState = { ...state };
  const newCardList = {
    id: action.details.id,
    title: action.details.title,
    isActive: action.details.isActive,
    boardId: action.details.boardId,
  };

  newState.cardList.push(newCardList);

  // console.log(newState);

  return newState;
}

// ADD_CARD REDUCER
function addCardReducer(state, action) {
  // console.log(state);
  // stateArray.push(state);

  const newState = { ...state };
  const newCard = {
    id: action.details.id,
    title: action.details.title,
    isActive: action.details.isActive,
    cardListId: action.details.cardListId,
  };

  newState.cards.push(newCard);

  // console.log(newState);

  return newState;
}
