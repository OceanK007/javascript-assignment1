let cardList = 
`<div class="list-wrapper list-box">
    <div class="m-2">
        <h5 class="card-list-title">To Do</h5>
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

// window.onload
window.onload = function() 
{
    addListenerToCardList();    
};


// Adding click event (Won't be executed until you click)
document.getElementById('card-list-name-submit').addEventListener('click', function() {addNewCardList(event, this)});

function addNewCardList(e, ref)
{
    // console.log(e);
    // console.log(ref);

    let cardListName = document.getElementById("card-list-name-input");
    // console.log(cardListName.value);

    let cardListContainer = document.getElementById("card-list-holder");
    let addCardListRef = document.getElementById("add-card-list");
    
    let cardListFragment = document.createRange().createContextualFragment(cardList); 
    cardListFragment.querySelector('.card-list-title').textContent = cardListName.value;
    //console.log(cardListFragment);
    cardListContainer.insertBefore(cardListFragment, addCardListRef);

    // Adding drag events
    App.applyEventsForInnerContainer();

    // Cleaning input value
    cardListName.value = "";

    addListenerToCardList();
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
        //let lastChild = ref.parentNode.parentNode;
        let cardFragment = document.createRange().createContextualFragment(card); 
        cardFragment.querySelector('.card-title').textContent = inputRef.value;
        cardContainer.append(cardFragment);

        // Adding click event to modify names
        addListenersToCard();

        // Adding drag events
        App.applyEventsForInnerContainer();

        //console.log(cardContainer);
    }

    // Cleaning input value
    inputRef.value = "";
}

function addListenersToCard()
{
    let addedCards = document.getElementsByClassName('box');
    // console.log(addedCardList);

    // Or use this iteration (ES6)
    Array.from(addedCards).forEach(function(element) 
    {
        // console.log(element);
        if(element.getAttribute('clickcount') == null)
        {
           element.setAttribute('clickcount', '1');
           element.addEventListener('click', function() {fetchTitle(event, this)});
        }
    });
}

function fetchTitle(e, ref)
{
    console.log(ref);
    var textareaId = document.getElementById('modify-title-area');
    textareaId.value = ref.text;
}

document.getElementById('modify-title-submit').addEventListener('click', function(){modifyTitle(event, this)});
function modifyTitle(e, ref)
{
    
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