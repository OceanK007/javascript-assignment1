import $ from 'jquery';
import { DragNDrop } from './dragndrop';
import Service from './service';
import { card } from './view';
import { saveUpdateData } from './dbcalls';
import {
  cardsURL, cardlistPrefix, cardPrefix,
} from './constant';
import { store } from './my-redux';

export function saveCard(data) {
  saveUpdateData(cardsURL, data, 'POST');
}

export function addCardAction(e) {
  const lastCardId = Service.getLastCardId();
  const cardNameRef = e.target.parentNode.previousElementSibling;
  const cardListId = Service.cardListRef.id.substring(cardlistPrefix.length);

  // console.log(lastCardId);
  // console.log(cardNameRef);
  // console.log(cardListId);

  if (cardNameRef.value === '') {
    alert('Please provide card title');
  } else {
    const newCardState = {
      id: Number(lastCardId) + 1, title: cardNameRef.value, isActive: true, cardListId: Number(cardListId),
    };

    // ACTION
    store.dispatch({ type: 'ADD_CARD', details: newCardState });

    // DB CALL
    saveCard(newCardState);
  }

  cardNameRef.value = '';
}

export function addListenersToCard() {
  const addedCards = document.getElementsByClassName('box');
  // console.log(addedCards);

  // Or use this iteration (ES6)
  Array.from(addedCards).forEach((element) => {
    // console.log(element);
    if (element.getAttribute('clickcount') == null) {
      element.setAttribute('clickcount', '1');
      element.addEventListener('click', function () { Service.fetchTitle(event, this, 'card'); });
    }
  });
}

export function renderCard(state) {
  if (Service.cardListRef != null) {
    const cardListId = Service.cardListRef.id.substring(cardlistPrefix.length);
    // console.log(cardListId);

    const cardContainerRef = document.getElementById(Service.cardListRef.id).lastElementChild.previousElementSibling;
    cardContainerRef.innerHTML = '';

    $.each(state.cards, (key, val) => {
      if (Number(val.cardListId) === Number(cardListId)) {
        // console.log(val.cardListId);
        // let lastChild = ref.parentNode.parentNode;
        // console.log(cardContainerRef);
        const cardFragment = document.createRange().createContextualFragment(card);
        cardFragment.querySelector('.card-title').textContent = val.title;
        cardFragment.querySelector('.card-title').id = cardPrefix + val.id;
        cardContainerRef.append(cardFragment);

        // Adding click event to modify names
        addListenersToCard();

        // Adding drag events
        DragNDrop.applyEventsForInnerContainer();
      }
    });
  }
}

// export function addCard(e)
// {
//     let inputRef = ref.parentNode.previousElementSibling;

//     if(inputRef.value == "")
//     {
//         alert("Please provide card name");
//     }
//     else
//     {
//         let cardContainer = ref.parentNode.parentNode.previousElementSibling;
//         let cardListId = cardContainer.parentNode.id;

//         //console.log(cardListId);

//         let lastCardId = 0;
//         if(cardContainer.lastElementChild != null)
//         {
//             lastCardId = cardContainer.lastElementChild.id;
//         }
//         //let lastChild = ref.parentNode.parentNode;
//         let cardFragment = document.createRange().createContextualFragment(card);
//         cardFragment.querySelector('.card-title').textContent = inputRef.value;
//         cardFragment.querySelector('.card-title').id = Number(lastCardId)+1;
//         cardContainer.append(cardFragment);

//         // Adding click event to modify names
//         addListenersToCard();

//         // Adding drag events
//         DragNDrop.applyEventsForInnerContainer();

//         //console.log(cardContainer);

//         fetchAndSaveCardToDB(Number(lastCardId)+1, inputRef.value, cardListId);
//     }

//     // Cleaning input value
//     inputRef.value = "";
// }

// export function addNewCard(e, currentCardRef)
// {
//     // console.log(e);
//     // console.log(currentCardRef);
//     addCard(e,currentCardRef);
// }

// export function fetchAndSaveCardToDB(id, title, cardListId) {
//   const newCard = { id, title };
//   // console.log(id);
//   // console.log(title);

//   const board = getData(`${boardsURL}/${Service.boardId}`);
//   $.each(board.cardList, function (key, val) {
//     if (val.id == cardListId) {
//       console.log(this.cards);
//       this.cards.push(newCard);
//       saveUpdateData(`boards/${Service.boardId}`, board, 'PUT');
//     }
//   });
// }