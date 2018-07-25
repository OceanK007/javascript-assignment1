import {DragNDrop} from './dragndrop';
import {Service} from './service';
import {cardList, card, board} from './view';
import {getBoards, getBoard, saveDataUsingURL} from './dbcalls';

export class CardListService
{
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

        Service.addListenerToCardList();
        Service.addListenersToCardListTitle();

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