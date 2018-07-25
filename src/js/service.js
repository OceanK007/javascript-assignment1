import $ from 'jquery';
import {getBoards, getBoard, saveDataUsingURL} from './dbcalls';
import {cardList, card, board} from './view';
import {DragNDrop} from './dragndrop';
import {CardService} from './card-service';

export class Service
{
    constructor() 
    {
        this.boardId = null;
        this.boardTitle = null;
        this.titleElementRef = null;
        this.deleteCardTitle = false;
        this.deleteCardListTitle = false;
    }

    static hideBoards()
    {
        document.getElementById('boardContainer').style.display = 'none';
    };

    static hideCardList()
    {
        document.getElementById('workplace').style.display = 'none';
    };

    static showBoards()
    {
        document.getElementById('boardContainer').style.display = 'block';
    };

    static showCardList()
    {
        document.getElementById('workplace').style.display = 'block';
    }

    static goToBoard()
    {
        Service.hideCardList();
        Service.showBoards();
    }

    static setTitleElementRef(ref)
    {
        this.titleElementRef = ref;
    }

    static getTitleElementRef()
    {
        return this.titleElementRef;
    }


    static setDeleteCardTitle(flag)
    {
        this.deleteCardTitle = flag;
    }

    static getDeleteCardTitle()
    {
        return this.deleteCardTitle;
    }


    static setDeleteCardListTitle(flag)
    {
        this.deleteCardListTitle = flag;
    }

    static getDeleteCardListTitle()
    {
        return this.deleteCardListTitle;
    }

    // START: Rendering board //
    renderBoards()
    {
        var boards = getBoards();   // DB call
        let boardContainer = document.getElementById('boards');
        $.each(boards, function(key,val)
        {
            //console.log("id: "+val.id+", title: "+val.title);
            let boardCreate = document.getElementById('board-create');
            let boardFragment = document.createRange().createContextualFragment(board); 
            //boardFragment.querySelector('.board').setAttribute("href", "board.html");
            boardFragment.querySelector('.board').id = val.id;
            boardFragment.querySelector('.board').textContent = val.title;
            boardContainer.insertBefore(boardFragment,boardCreate);
        });

        this.addListenersToBoards();
    }

    // END: Rendering board //

    // START: Adding listener to boards //
    addListenersToBoards()
    {
        let boardList = document.getElementsByClassName('board');
        //console.log(cardListTitles);

        // Or use this iteration (ES6)
        Array.from(boardList).forEach(function(element) 
        {
            // console.log(element);
            if(element.getAttribute('clickcount') == null)
            {
                element.setAttribute('clickcount', '1');
                element.addEventListener('click', function() {Service.getBoardCardList(event, this)});
            }
        });
    }
    // END: Adding listener to boards //

    // START: Adding new board //
    addNewBoard(e, ref)
    {
        let boardName = document.getElementById("board-input");
        let boardContainer = document.getElementById("boards");
        let boardCreate = document.getElementById('board-create');
        let lastBoardId = 0;
        if(boardContainer.lastElementChild.previousElementSibling != null)
        {
            lastBoardId = boardContainer.lastElementChild.previousElementSibling.id;
        }
        
        let boardFragment = document.createRange().createContextualFragment(board); 
        boardFragment.querySelector('.board').textContent = boardName.value;
        boardFragment.querySelector('.board').id = Number(lastBoardId)+1;
        
        boardContainer.insertBefore(boardFragment, boardCreate);

        this.addListenersToBoards();

        this.fetchAndSaveBoardToDB(Number(lastBoardId)+1, boardName.value);

        // Cleaning input value
        boardName.value = "";
    }
    // END: Adding new board //

    // START: Saving board to DB //
    fetchAndSaveBoardToDB(id, title)
    {
        var arr = new Array();
        var newBoard = {"id":id, "title":title, "cardList":arr};
        //console.log(id);
        //console.log(title);

        saveDataUsingURL("boards", newBoard, "POST");
    }
    // END: Saving board to DB //

    // START: Fetching card list based on board id //
    static getBoardCardList(e, ref)
    {
        Service.hideBoards();
        this.showCardList();
        this.boardId = e.target.id;
        this.boardTitle = ref.textContent;
        //console.log(this.boardId);
        //console.log(this.boardTitle);
        document.getElementById('board-title').textContent = this.boardTitle;
        var board = getBoard(this.boardId);
        //console.log("board: "+board);

        this.renderCardList(board);
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

            Service.addListenerToCardList();
            Service.addListenersToCardListTitle();

            // Adding click event to modify names
            Service.addListenersToCard();
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
                element.addEventListener('click', function() {fetchTitle(event, this, 'cardList')});
            }
        });
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

    static fetchTitle(e, ref, cardOrList)
    {
        console.log(ref.textContent);
        var textareaId = document.getElementById('modify-title-area');
        textareaId.value = ref.textContent;

        Service.setTitleElementRef(ref);
        //console.log(Service.getTitleElementRef());

        var modalTitle = document.getElementById('title-modal');
        var modalDeleteText = document.getElementById('delete-title-submit');

        if(cardOrList == 'card')
        {
            Service.setDeleteCardTitle(true);
            Service.setDeleteCardListTitle(false);
            modalTitle.textContent = "Modify Card Title / Delete Card";
            modalDeleteText.textContent = "Delete Card";
        }
        else if (cardOrList == 'cardList')
        {
            Service.setDeleteCardTitle(false);
            Service.setDeleteCardListTitle(true);
            modalTitle.textContent = "Modify Card-List Title / Delete Card-List";
            modalDeleteText.textContent = "Delete Card-List";
        }

        //console.log("deleteCardTitle: "+this.deleteCardTitle);
        //console.log("deleteCardListTitle: "+ this.deleteCardListTitle);
    }

    modifyTitle(e, ref)
    {
        //console.log(this.titleElementRef.textContent);
        //console.log(document.getElementById('modify-title-area').value);
        Service.getTitleElementRef().textContent = document.getElementById('modify-title-area').value;
    }

    deleteElement(e, ref)
    {
        if(Service.getDeleteCardTitle() == true)
        {
            Service.getTitleElementRef().parentNode.removeChild(Service.getTitleElementRef());
        }
        else if (Service.getDeleteCardListTitle() == true)
        {
            Service.getTitleElementRef().parentNode.parentNode.parentNode.removeChild(Service.getTitleElementRef().parentNode.parentNode);
        }
    }
}