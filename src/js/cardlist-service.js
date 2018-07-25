import {DragNDrop} from './dragndrop';
import {Service} from './service';
import {CardService} from './card-service';
import {cardList, card, board} from './view';
import {getBoards, getBoard, saveDataUsingURL} from './dbcalls';
import $ from 'jquery';

export class CardListService
{
    // START: Fetching card list based on board id //
    static getBoardCardList(e, ref)
    {
        Service.hideBoards();
        Service.showCardList();
        Service.boardId = e.target.id;
        Service.boardTitle = ref.textContent;
        //console.log(Service.boardId);
        //console.log(Service.boardTitle);
        document.getElementById('board-title').textContent = Service.boardTitle;
        var board = getBoard(Service.boardId);
        //console.log("board: "+board);

        CardListService.renderCardList(board);
    }

    static renderCardList(board)
    {
        $.each(board.cardList, function(key,val)
        {
            let cardListContainer = document.getElementById("card-list-holder");  
            let addCardListRef = document.getElementById("add-card-list");          
            let cardListFragment = document.createRange().createContextualFragment(cardList); 
            cardListFragment.querySelector('.card-list-title').textContent = val.title;
            cardListFragment.querySelector('.list-wrapper').id = val.id;

            $.each(val.cards, function(k,v)
            {
                let cardContainer = cardListFragment.querySelector('.holder');  
                let cardFragment = document.createRange().createContextualFragment(card); 
                cardFragment.querySelector('.card-title').textContent = v.title;
                cardFragment.querySelector('.card-title').id = v.id;
                cardContainer.append(cardFragment);
            });

            cardListContainer.insertBefore(cardListFragment, addCardListRef);

            // Adding drag events
            DragNDrop.applyEventsForInnerContainer();

            CardListService.addListenerToCardList();
            CardListService.addListenersToCardListTitle();

            // Adding click event to modify names
            CardService.addListenersToCard();
        });
    }
    // END: Fetching card list based on board id //

    static addListenerToCardList()
    {   
        // Adding listener to same kind of classes
        let addedCardList = document.getElementsByClassName('card-name-submit');
        // console.log(addedCardList);

        // Using normal iteration
        // for(let i=0;i<addedCardList.length;i++)
        // {
        //     addedCardList[i].addEventListener('click', function() {addNewCard(event, this)});
        // }

        // Or use this iteration (ES6)
        Array.from(addedCardList).forEach(function(element) 
        {
            // console.log(element);
            if(element.getAttribute('clickcount') == null)
            {
                element.setAttribute('clickcount', '1');
                element.addEventListener('click', function() {CardService.addNewCard(event, this)});
            }
        });
    }

    static addListenersToCardListTitle()
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

    static addNewCardList(e, ref)
    {
        // console.log(e);
        // console.log(ref);

        let cardListName = document.getElementById("card-list-name-input");
        // console.log(cardListName.value);

        let cardListContainer = document.getElementById("card-list-holder");
        let lastCardListId = 0;
        if(cardListContainer.lastElementChild.previousElementSibling != null)
        {
            lastCardListId = cardListContainer.lastElementChild.previousElementSibling.id;
        }
        let addCardListRef = document.getElementById("add-card-list");
        
        let cardListFragment = document.createRange().createContextualFragment(cardList); 
        cardListFragment.querySelector('.card-list-title').textContent = cardListName.value;
        cardListFragment.querySelector('.card-list-title').parentNode.parentNode.id = Number(lastCardListId)+1;
        //console.log(cardListFragment);
        cardListContainer.insertBefore(cardListFragment, addCardListRef);

        // Adding drag events
        DragNDrop.applyEventsForInnerContainer();

        CardListService.addListenerToCardList();
        CardListService.addListenersToCardListTitle();

        // Save cardlist to DB
        CardListService.fetchAndSaveCardListToDB(Number(lastCardListId)+1, cardListName.value);

        // Cleaning input value
        cardListName.value = "";
    }

    static fetchAndSaveCardListToDB(id, title)
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
}