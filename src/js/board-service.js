import {cardList, card, board} from './view';
import {Service} from './service';
import {CardListService} from './cardlist-service';
import {getBoards, getBoard, saveDataUsingURL} from './dbcalls';
import $ from 'jquery';

export class BoardService
{
    // START: Rendering board //
    static renderBoards(boards)
    {
        //var boards = getBoards();   // DB call
        let boardContainer = document.getElementById('boards');
        
        // Delete all element except last element
        Service.deletePreviousSiblings(document.getElementById('board-create'));

        $.each(boards, function(key,val)
        {
            if(val.isActive == true)
            {
                //console.log("id: "+val.id+", title: "+val.title);
                let boardCreate = document.getElementById('board-create');
                let boardFragment = document.createRange().createContextualFragment(board); 
                //boardFragment.querySelector('.board').setAttribute("href", "board.html");
                boardFragment.querySelector('.board').id = val.id;
                boardFragment.querySelector('.board').textContent = val.title;
                boardContainer.insertBefore(boardFragment,boardCreate);
            }
        });

        BoardService.addListenersToBoards();
    }

    // END: Rendering board //

    // START: Adding listener to boards //
    static addListenersToBoards()
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
                element.addEventListener('click', function() {CardListService.getBoardCardList(event, this)});
            }
        });
    }
    // END: Adding listener to boards //

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

    static getBoards()
    {
        return getBoards();
    }

    static saveBoard(data)
    {
        saveDataUsingURL("boards", data, "POST");
    }
}