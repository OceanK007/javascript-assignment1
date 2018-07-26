import $ from 'jquery';
import {getData, saveDataUsingURL} from './dbcalls';
import {cardList, card, board} from './view';
import {DragNDrop} from './dragndrop';
import {CardService} from './card-service';
import {boardsURL, cardListURL, cardsURL} from './constant';

let _boardId = null;
let _boardTitle = null;
let _cardListRef = null;
let _titleElementRef = null;
let _deleteCardTitle = false;
let _deleteCardListTitle = false;

export class Service
{
    constructor() 
    {        

    }

    // START : Getters and Setters //
    static get boardId()
    {
        //console.log("boardId getter");
        return _boardId;
    }

    static set boardId(bId)
    {
        //console.log("boardId setter");
        _boardId = bId;
    }

    static get boardTitle()
    {
        return _boardTitle;
    }

    static set boardTitle(title)
    {
        _boardTitle = title;
    }

    static get cardListRef()
    {
        return _cardListRef;
    }

    static set cardListRef(ref)
    {
        _cardListRef = ref;
    }

    static set titleElementRef(ref)
    {
        _titleElementRef = ref;
    }

    static get titleElementRef()
    {
        return _titleElementRef;
    }

    static set deleteCardTitle(flag)
    {
        _deleteCardTitle = flag;
    }

    static get deleteCardTitle()
    {
        return _deleteCardTitle;
    }

    static set deleteCardListTitle(flag)
    {
        _deleteCardListTitle = flag;
    }

    static get deleteCardListTitle()
    {
        return _deleteCardListTitle;
    } 

    // END : Getters and Setters //

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

    static fetchTitle(e, ref, cardOrList)
    {
        console.log(ref.textContent);
        var textareaId = document.getElementById('modify-title-area');
        textareaId.value = ref.textContent;

        Service.titleElementRef = ref;
        //console.log(Service.getTitleElementRef());

        var modalTitle = document.getElementById('title-modal');
        var modalDeleteText = document.getElementById('delete-title-submit');

        if(cardOrList == 'card')
        {
            Service.deleteCardTitle= true;
            Service.deleteCardListTitle= false;
            modalTitle.textContent = "Modify Card Title / Delete Card";
            modalDeleteText.textContent = "Delete Card";
        }
        else if (cardOrList == 'cardList')
        {
            Service.deleteCardTitle = false;
            Service.deleteCardListTitle = true;
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
        Service.titleElementRef.textContent = document.getElementById('modify-title-area').value;
    }

    deleteElement(e, ref)
    {
        if(Service.deleteCardTitle == true)
        {
            Service.titleElementRef.parentNode.removeChild(Service.titleElementRef);
        }
        else if (Service.deleteCardListTitle == true)
        {
            Service.titleElementRef.parentNode.parentNode.parentNode.removeChild(Service.titleElementRef.parentNode.parentNode);
        }
    }

    static createHTMLElement(htmlString) 
    {
        const template = document.createElement('template');
        template.innerHTML = htmlString;
        return template.content.firstElementChild;
    }

    static getLastBoardId()
    {
        var data = getData(boardsURL);
        //console.log(data);
        var lastBoardId = 0;
        if(data.length > 0)
        {
            lastBoardId = data[data.length-1].id;
        }
        //console.log(lastBoardId);
        return lastBoardId;
    }

    static getLastCardListId()
    {
        var data = getData(cardListURL);
        console.log(data);

        var lastCardListId = 0;
        //console.log(data.length);
        if(data.length > 0)
        {
            lastCardListId = data[data.length-1].id;
            console.log(lastCardListId);
        }
        
        return lastCardListId;
    }

    static getLastCardId()
    {
        var data = getData(cardsURL);
        console.log(data);

        var lastCardId = 0;
        //console.log(data.length);
        if(data.length > 0)
        {
            lastCardId = data[data.length-1].id;
            console.log(lastCardId);
        }
        
        return lastCardId;
    }

    static deletePreviousSiblings(lastElementRef)
    {        
        // iterate until we find an element node or there is no previous sibling
        while(lastElementRef.previousSibling != null) 
        {
            lastElementRef.parentNode.removeChild(lastElementRef.previousSibling);
        }
    }
}