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

    static createHTMLElement(htmlString) 
    {
        const template = document.createElement('template');
        template.innerHTML = htmlString;
        return template.content.firstElementChild;
    }

    static getLastElementId()
    {
        var data = getBoards();
        console.log(data);
        var lastBoardId = data[data.length-1].id;
        console.log(lastBoardId);
        return lastBoardId;
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