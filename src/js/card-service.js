import {DragNDrop} from './dragndrop';
import {Service} from './service';
import {cardList, card, board} from './view';
import {getBoards, getBoard, saveDataUsingURL} from './dbcalls';
import $ from 'jquery';

export class CardService
{
    static addNewCard(e, currentCardRef)
    {
        // console.log(e);
        // console.log(currentCardRef);
        CardService.addCard(e,currentCardRef);
    }

    static addListenersToCard()
    {
        let addedCards = document.getElementsByClassName('box');
        // console.log(addedCards);

        // Or use this iteration (ES6)
        Array.from(addedCards).forEach(function(element) 
        {
            // console.log(element);
            if(element.getAttribute('clickcount') == null)
            {
                element.setAttribute('clickcount', '1');
                element.addEventListener('click', function() {Service.fetchTitle(event, this, 'card')});
            }
        });
    }

    static addCard(e, ref)
    {
        let inputRef = ref.parentNode.previousElementSibling;

        if(inputRef.value == "")
        {
            alert("Please provide card name");
        }
        else
        {
            let cardContainer = ref.parentNode.parentNode.previousElementSibling;
            let cardListId = cardContainer.parentNode.id;

            //console.log(cardListId);

            let lastCardId = 0;
            if(cardContainer.lastElementChild != null)
            {
                lastCardId = cardContainer.lastElementChild.id;
            }
            //let lastChild = ref.parentNode.parentNode;
            let cardFragment = document.createRange().createContextualFragment(card); 
            cardFragment.querySelector('.card-title').textContent = inputRef.value;
            cardFragment.querySelector('.card-title').id = Number(lastCardId)+1;
            cardContainer.append(cardFragment);

            // Adding click event to modify names
            CardService.addListenersToCard();

            // Adding drag events
            DragNDrop.applyEventsForInnerContainer();

            //console.log(cardContainer);

            CardService.fetchAndSaveCardToDB(Number(lastCardId)+1, inputRef.value, cardListId);
        }

        // Cleaning input value
        inputRef.value = "";
    }

    static fetchAndSaveCardToDB(id, title, cardListId)
    {
        var newCard = {"id":id, "title":title};
        //console.log(id);
        //console.log(title);

        var board = getBoard(Service.boardId);
        $.each(board.cardList, function(key,val)
        {
            if(val.id == cardListId)
            {      
                console.log(this.cards);
                this.cards.push(newCard);
                saveDataUsingURL("boards/"+Service.boardId, board, "PUT");
            }
        });
    }
}