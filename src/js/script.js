let cardList = 
`<div class="list-wrapper">
    <div class="m-2">
        <!-- List of cards : name -->
        <div>
            <h5 class="card-list-title">To Do</h5>
        </div>

        <!-- List of cards : options -->
        <div class="add-card-container">
            <label class="sr-only">Add another card</label>
            <input class="card-name-input form-control mb-2" type="text" name="name" placeholder="Enter card name..." autocomplete="off" maxlength="512">
            <div>
                <button class="card-name-submit btn btn-success">Add Card</button>
            </div>
        </div>
    </div>
</div>`;

let card = 
`<div >
    <a class="form-control mb-2 list-card" href="#">
        <div class="card-details">
            <span class="card-title">CardOne</span>
        </div>
    </a>
</div>`;

// window.onload
window.onload = function() 
{
    addListenerToCard();    
};

// Adding click event (Won't be executed until you click)
document.getElementById('card-list-name-submit').addEventListener('click', function() {addNewCardList(event, this)});

function addNewCardList(e, ref)
{
    // console.log(e);
    // console.log(ref);

    let cardListName = document.getElementById("card-list-name-input");
    // console.log(cardListName.value);

    let cardListContainer = document.getElementById("card-list-container");
    let addCardListRef = document.getElementById("add-card-list");
    
    let cardListFragment = document.createRange().createContextualFragment(cardList); 
    cardListFragment.querySelector('.card-list-title').textContent = cardListName.value;
    //console.log(cardListFragment);
    cardListContainer.insertBefore(cardListFragment, addCardListRef);

    // Cleaning input value
    cardListName.value = "";

    addListenerToCard();
}

var addListenerToCard = function()
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
        if(element.getAttribute('count') == null)
        {
           element.setAttribute('count', '1');
           element.addEventListener('click', function() {addNewCard(event, this)});
        }
    });

    function addNewCard(e, currentCardRef)
    {
        // console.log(e);
        // console.log(currentCardRef);
        addCard(e,currentCardRef);
    }
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
        let cardContainer = ref.parentNode.parentNode.parentNode;
        let lastChild = ref.parentNode.parentNode;
        let cardFragment = document.createRange().createContextualFragment(card); 
        cardFragment.querySelector('.card-title').textContent = inputRef.value;
        cardContainer.insertBefore(cardFragment,lastChild);
        console.log(cardContainer);
    }

    // Cleaning input value
    inputRef.value = "";
}

