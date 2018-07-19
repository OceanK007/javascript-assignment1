const localhostURL = 'http://localhost:3000';
let cardList = 
`<div class="list-wrapper list-box">
    <div class="m-2">
        <h5 class="card-list-title" data-toggle="modal" data-target="#myModal">To Do</h5>
    </div>

    <div class="m-2 holder"></div>

    <div class="m-2">
        <label class="sr-only">Add another card</label>
        <input class="card-name-input form-control mb-2" type="text" name="name" placeholder="Enter card name..." autocomplete="off" maxlength="512">
        <div>
            <button class="card-name-submit btn btn-success">Add Card</button>
        </div>
    </div>
</div>`;

let card = `<a class="box form-control mb-2 list-card card-title" href="#" data-toggle="modal" data-target="#myModal">CardOne</a>`;
let board = `<a href="#" class="p-2 bd-highlight board" onclick="getBoardCardList(this, this.id)">Flex item</a>`;
let titleElementRef = null;
let deleteCardTitle = false;
let deleteCardListTitle = false;
let boardId = null;

// window.onload
window.onload = function() 
{
    hideCardList()
    fetchBoards();
    addListenerToCardList();    
    addListenersToCardListTitle();
};

function hideBoards()
{
    document.getElementById('boardContainer').style.display = 'none';
}

function hideCardList()
{
    document.getElementById('workplace').style.display = 'none';
}

function showBoards()
{
    document.getElementById('boardContainer').style.display = 'block';
}

function showCardList()
{
    document.getElementById('workplace').style.display = 'block';
}

// START: Fetching boards //
function fetchBoards()
{
    $.ajax
    ({
        type: "GET",
        url: localhostURL+"/boards",
        //data: {varName : varValue},
        //dataType: "text",
        success: function(data)
        {
            //console.log(data);
            let boardContainer = document.getElementById('boards');
            $.each(data, function(key,val)
            {
                //console.log("id: "+val.id+", title: "+val.title);
                let boardCreate = document.getElementById('board-create');
                let boardFragment = document.createRange().createContextualFragment(board); 
                //boardFragment.querySelector('.board').setAttribute("href", "board.html");
                boardFragment.querySelector('.board').id = val.id;
                boardFragment.querySelector('.board').textContent = val.title;
                boardContainer.insertBefore(boardFragment,boardCreate);
            });
        },
        error: function(ex)
        {
            console.error("Unable to get data");
        }
    });
}
// END: Fetching boards //

// START: Fetching card list based on board id //
function getBoardCardList(ref, id)
{
    hideBoards();
    showCardList();
    boardId = id;
    //console.log(boardId);

    $.ajax
    ({
        type: "GET",
        url: localhostURL+"/boards/"+id,
        //data: {varName : varValue},
        //dataType: "text",
        success: function(data)
        {
            //console.log(data);
            
            $.each(data.cardList, function(key,val)
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
                App.applyEventsForInnerContainer();

                addListenerToCardList();
                addListenersToCardListTitle();

                // Adding click event to modify names
                addListenersToCard();
            });
        },
        error: function(ex)
        {
            console.error("Unable to get data");
        }
    });
}

// END: Fetching card list based on board id //

// Adding click event for board creation
document.getElementById('board-submit').addEventListener('click', function() {addNewBoard(event, this)});

// Adding click event (Won't be executed until you click)
document.getElementById('card-list-name-submit').addEventListener('click', function() {addNewCardList(event, this)});

function addNewBoard(e, ref)
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

    fetchAndSaveBoardToDB(Number(lastBoardId)+1, boardName.value);

    // Cleaning input value
    boardName.value = "";
}

function fetchAndSaveBoardToDB(id, title)
{
    var arr = new Array();
    var newBoard = {"id":id, "title":title, "cardList":arr};
    //console.log(id);
    //console.log(title);

    saveDataUsingURL(localhostURL+"/boards/", newBoard, "POST");
}

function addNewCardList(e, ref)
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
    App.applyEventsForInnerContainer();

    addListenerToCardList();
    addListenersToCardListTitle();

    // Save cardlist to DB
    fetchAndSaveCardListToDB(Number(lastCardListId)+1, cardListName.value);

    // Cleaning input value
    cardListName.value = "";
}

function fetchAndSaveCardListToDB(id, title)
{
    var arr = new Array();
    var newCardList = {"id":id, "title":title, "cards":arr};
    //console.log(id);
    //console.log(title);

    $.ajax
    ({
        type: "GET",
        url: localhostURL+"/boards/"+boardId,
        //data: {varName : varValue},
        //dataType: "text",
        success: function(data)
        {
            console.log(data)
            //console.log(data.cardList);
            data.cardList.push(newCardList);
            //console.log(data.cardList);
            console.log(data);
            saveDataUsingURL(localhostURL+"/boards/"+boardId, data, "PUT");
        },
        error: function(ex)
        {
            console.error("Unable to get data");
        }
    });
}

function saveDataUsingURL(url, data, requestType)
{
    console.log(url);

    $.ajax
    ({
        type: requestType,
        url: url,
        data: JSON.stringify(data),
        contentType : "application/json",
        //dataType: "text",
        success: function(data)
        {
            console.log(data);
        },
        error: function(ex)
        {
            console.error("Unable to get data");
        }
    });
}

var addListenerToCardList = function()
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
           element.addEventListener('click', function() {addNewCard(event, this)});
        }
    });
}

function addNewCard(e, currentCardRef)
{
    // console.log(e);
    // console.log(currentCardRef);
    addCard(e,currentCardRef);
}

function addCard(e, ref)
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
        addListenersToCard();

        // Adding drag events
        App.applyEventsForInnerContainer();

        //console.log(cardContainer);

        fetchAndSaveCardToDB(Number(lastCardId)+1, inputRef.value, cardListId);
    }

    // Cleaning input value
    inputRef.value = "";
}

function fetchAndSaveCardToDB(id, title, cardListId)
{
    var newCard = {"id":id, "title":title};
    //console.log(id);
    //console.log(title);

    $.ajax
    ({
        type: "GET",
        url: localhostURL+"/boards/"+boardId,
        //data: {varName : varValue},
        //dataType: "text",
        success: function(data)
        {
            console.log(data)
            //console.log(data.cardList);
            $.each(data.cardList, function(key,val)
            {
                if(val.id == cardListId)
                {      
                    console.log(this.cards);
                    this.cards.push(newCard);
                    saveDataUsingURL(localhostURL+"/boards/"+boardId, data, "PUT");
                }
            });
        },
        error: function(ex)
        {
            console.error("Unable to get data");
        }
    });
}

function addListenersToCard()
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
           element.addEventListener('click', function() {fetchTitle(event, this, 'card')});
        }
    });
}

function addListenersToCardListTitle()
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


function fetchTitle(e, ref, cardOrList)
{
    console.log(ref.textContent);
    var textareaId = document.getElementById('modify-title-area');
    textareaId.value = ref.textContent;

    titleElementRef = ref;

    var modalTitle = document.getElementById('title-modal');
    var modalDeleteText = document.getElementById('delete-title-submit');

    if(cardOrList == 'card')
    {
        deleteCardTitle = true;
        deleteCardListTitle = false;
        modalTitle.textContent = "Modify Card Title / Delete Card";
        modalDeleteText.textContent = "Delete Card";
    }
    else if (cardOrList == 'cardList')
    {
        deleteCardTitle = false;
        deleteCardListTitle = true;
        modalTitle.textContent = "Modify Card-List Title / Delete Card-List";
        modalDeleteText.textContent = "Delete Card-List";
    }

    //console.log("deleteCardTitle: "+deleteCardTitle);
    //console.log("deleteCardListTitle: "+ deleteCardListTitle);
}

document.getElementById('modify-title-submit').addEventListener('click', function(){modifyTitle(event, this)});
function modifyTitle(e, ref)
{
    //console.log(titleElementRef.textContent);
    //console.log(document.getElementById('modify-title-area').value);
    titleElementRef.textContent = document.getElementById('modify-title-area').value;
}

document.getElementById('delete-title-submit').addEventListener('click', function(){deleteElement(event, this)});
function deleteElement(e, ref)
{
    if(deleteCardTitle == true)
    {
        titleElementRef.parentNode.removeChild(titleElementRef);
    }
    else if (deleteCardListTitle == true)
    {
        titleElementRef.parentNode.parentNode.parentNode.removeChild(titleElementRef.parentNode.parentNode);
    }
}


// START : drag and drop functionality //
class App 
{
    static init() 
    {
        let draggableElement = "";
        let insertBeforeElement = "";
        App.applyEventsForInnerContainer();
        //App.applyEventsForOuterContainer();
    }

    // static applyEventsForOuterContainer()
    // {
    //     let outerHolders = document.getElementById('card-list-holder');
    //     let innerBoxes = document.getElementsByClassName('list-box');

    //     //console.log(outerHolders);
    //     //console.log(innerBoxes);

    //     for(const b of innerBoxes)
    //     {
    //         //console.log(b);
    //         if(b.getAttribute('draggable') == null)
    //         {
    //             //b.setAttribute('draggable', 'true');
    //             //b.addEventListener("dragstart", function(){App.dragstart(event,this);})
    //             //b.addEventListener("dragend", function(){App.dragend(event);})
    //         }
    //     }

    //     if(outerHolders.getAttribute('dragcount') == null)
    //     {
    //         //outerHolders.setAttribute('dragcount', '1');
    //         //outerHolders.addEventListener("dragover", function(){App.dragoverOuter(event, this);})
    //         //outerHolders.addEventListener("dragenter", function(){App.dragenter(event, this);})
    //         //outerHolders.addEventListener("dragleave", function(){App.dragleave(event, this);})
    //         //outerHolders.addEventListener("drop", function(){App.dropOuter(event,this)})
    //     }
    // }

    static applyEventsForInnerContainer()
    {
        let boxes = document.getElementsByClassName('box');
        let holders = document.getElementsByClassName('holder');
        //console.log(boxes);
        //console.log(holders);

        for(const b of boxes)
        {
            //console.log(b);
            if(b.getAttribute('draggable') == null)
            {
                b.setAttribute('draggable', 'true');
                b.addEventListener("dragstart", function(){App.dragstart(event,this);})
                b.addEventListener("dragend", function(){App.dragend(event);})
            }
        }

        for(const h of holders) 
        {
            //console.log(h);
            if(h.getAttribute('dragcount') == null)
            {
                h.setAttribute('dragcount', '1');
                h.addEventListener("dragover", function(){App.dragover(event, this);})
                h.addEventListener("dragenter", function(){App.dragenter(event, this);})
                h.addEventListener("dragleave", function(){App.dragleave(event, this);})
                h.addEventListener("drop", function(){App.drop(event,this)})
            }
        }
    }

    static dragstart(e, ref) 
    {
        //console.log(e);
        console.log(ref);
        this.draggableElement = ref;
        //console.log(this.draggableElement);
    }

    static dragend(e) 
    {
        //console.log("end");
    }

    static dragover(e) 
    {
        e.preventDefault();
        //e.stopPropagation();
        var target = e.target;

        if(this.draggableElement == e.target)
        {
            console.log("Over");
        }
        else
        {
            //console.log(target.className);
            this.insertBeforeElement = target;
            // console.log(this.insertBeforeElement);
        }
    }

    static dragenter(e) 
    {
        e.preventDefault();
        //console.log("enter");
        //console.log(e.target);
    }

    static dragleave(e) 
    {
        //console.log("leave");
        //console.log(e.target);
    }

    static drop(e, ref) 
    {
        e.stopPropagation();
        if(this.insertBeforeElement.className == 'holder')  // Empty container
        {
            ref.append(this.draggableElement);
        }
        else
        {
            ref.insertBefore(this.draggableElement, this.insertBeforeElement);
        }
    }
}

document.addEventListener("DOMContentLoaded", App.init)
// END : drag and drop functionality //

