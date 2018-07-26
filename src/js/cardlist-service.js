import {DragNDrop} from './dragndrop';
import {Service} from './service';
import {addListenersToCard, addNewCard, addCardAction} from './card-service';
import {cardList, card, board} from './view';
import {getData, saveUpdateData} from './dbcalls';
import {boardsURL, cardListURL, cardsURL, cardlistPrefix, cardPrefix} from './constant';
import {store} from './my-redux';
import $ from 'jquery';

export function addCardListAction()
{
    var lastCardListId = Service.getLastCardListId();
    let cardListNameRef = document.getElementById("card-list-name-input");

    if(cardListNameRef.value == "")
    {
        alert("Please provide card list title");
    }
    else
    {
        var newCardListState = {id:Number(lastCardListId)+1, title:cardListNameRef.value, isActive:true, boardId: Number(Service.boardId)};

        // ACTION
        store.dispatch({type: 'ADD_CARD_LIST', details: newCardListState});

        // DB CALL
        saveCardList(newCardListState);
    }
}

// static getAndRenderCardList()
// {
//     var cardListData = getData(cardListURL+'?boardId='+Service.boardId);
//     //console.log(cardListData);
//     CardListService.renderCardList(cardListData);

// }

// START: Fetching card list //
export function renderCardList(state)
{
    console.log(state);
    console.log(Service.boardId);

    document.getElementById('board-title').textContent = Service.boardTitle;

    // Delete all element except last element
    Service.deletePreviousSiblings(document.getElementById('add-card-list'));

    $.each(state.cardList, function(key,val)
    {
        if(val.boardId == Service.boardId)
        {
            let cardListContainer = document.getElementById("card-list-holder");  
            let addCardListRef = document.getElementById("add-card-list");          
            let cardListFragment = document.createRange().createContextualFragment(cardList); 
            cardListFragment.querySelector('.card-list-title').textContent = val.title;
            cardListFragment.querySelector('.list-wrapper').id = cardlistPrefix+val.id;

            let cards = getData(cardsURL+'?cardListId='+val.id);
            $.each(cards, function(k,v)
            {
                let cardContainer = cardListFragment.querySelector('.holder');  
                let cardFragment = document.createRange().createContextualFragment(card); 
                cardFragment.querySelector('.card-title').textContent = v.title;
                cardFragment.querySelector('.card-title').id = cardPrefix+v.id;
                cardContainer.append(cardFragment);
            });

            cardListContainer.insertBefore(cardListFragment, addCardListRef);

            // Adding drag events
            DragNDrop.applyEventsForInnerContainer();

            addListenerToCardList();
            addListenersToCardListTitle();

            // Adding click event to modify names
            addListenersToCard();
        }
    });

    document.getElementById('card-list-name-input').value = '';
}
// END: Fetching card list based on board id //

export function addListenerToCardList()
{   
    // Adding listener to same kind of classes
    let addedCardList = document.getElementsByClassName('card-name-submit');
    // console.log(addedCardList);

    // Or use this iteration (ES6)
    Array.from(addedCardList).forEach(function(element) 
    {
        // console.log(element);
        if(element.getAttribute('clickcount') == null)
        {
            element.setAttribute('clickcount', '1');
            element.addEventListener('click', function() 
            {
                settingCardListInfo(event);
                addCardAction(event);
            });
        }
    });
}

// START: Setting cardList information //
export function settingCardListInfo(e)
{
    Service.cardListRef = e.target.parentElement.parentElement.parentElement;  // Will automatically call setter
    //console.log(Service.cardListRef);
}
// END: Setting cardList information //

export function addListenersToCardListTitle()
{
    let cardListTitles = document.getElementsByClassName('card-list-title');
    //console.log(cardListTitles);

    // Or use this iteration (ES6)
    Array.from(cardListTitles).forEach(function(element) 
    {
        // console.log(element);
        if(element.getAttribute('clickcount') == null)
        {
            element.setAttribute('clickcount', '1');
            element.addEventListener('click', function() {Service.fetchTitle(event, this, 'cardList')});
        }
    });
}

// export function addNewCardList(e, ref)
// {
//     // console.log(e);
//     // console.log(ref);

//     let cardListName = document.getElementById("card-list-name-input");
//     // console.log(cardListName.value);

//     let cardListContainer = document.getElementById("card-list-holder");
//     let lastCardListId = 0;
//     if(cardListContainer.lastElementChild.previousElementSibling != null)
//     {
//         lastCardListId = cardListContainer.lastElementChild.previousElementSibling.id;
//     }
//     let addCardListRef = document.getElementById("add-card-list");
    
//     let cardListFragment = document.createRange().createContextualFragment(cardList); 
//     cardListFragment.querySelector('.card-list-title').textContent = cardListName.value;
//     cardListFragment.querySelector('.card-list-title').parentNode.parentNode.id = Number(lastCardListId)+1;
//     //console.log(cardListFragment);
//     cardListContainer.insertBefore(cardListFragment, addCardListRef);

//     // Adding drag events
//     DragNDrop.applyEventsForInnerContainer();

//     CardListService.addListenerToCardList();
//     CardListService.addListenersToCardListTitle();

//     // Save cardlist to DB
//     CardListService.fetchAndSaveCardListToDB(Number(lastCardListId)+1, cardListName.value);

//     // Cleaning input value
//     cardListName.value = "";
// }

export function fetchAndSaveCardListToDB(id, title)
{
    var arr = new Array();
    var newCardList = {"id":id, "title":title, "cards":arr};
    //console.log(id);
    //console.log(title);

    //console.log(Service.boardId);
    var board = getBoard(Service.boardId);
    console.log(board);
    board.cardList.push(newCardList);
    saveDataUsingURL("boards/"+Service.boardId, board, "PUT");
}

export function saveCardList(data)
{
    saveUpdateData(cardListURL, data, "POST");
}
