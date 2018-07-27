import { getData } from './dbcalls';
import { boardsURL, cardListURL, cardsURL } from './constant';

let boardIdGlobal = null;
let boardTitleGlobal = null;
let cardListRefGlobal = null;
let titleElementRefGlobal = null;
let deleteCardTitleGlobal = false;
let deleteCardListTitleGlobal = false;

export default class Service {
  // START : Getters and Setters //
  static get boardId() {
    // console.log("boardId getter");
    return boardIdGlobal;
  }

  static set boardId(bId) {
    // console.log("boardId setter");
    boardIdGlobal = bId;
  }

  static get boardTitle() {
    return boardTitleGlobal;
  }

  static set boardTitle(title) {
    boardTitleGlobal = title;
  }

  static get cardListRef() {
    return cardListRefGlobal;
  }

  static set cardListRef(ref) {
    cardListRefGlobal = ref;
  }

  static set titleElementRef(ref) {
    titleElementRefGlobal = ref;
  }

  static get titleElementRef() {
    return titleElementRefGlobal;
  }

  static set deleteCardTitle(flag) {
    deleteCardTitleGlobal = flag;
  }

  static get deleteCardTitle() {
    return deleteCardTitleGlobal;
  }

  static set deleteCardListTitle(flag) {
    deleteCardListTitleGlobal = flag;
  }

  static get deleteCardListTitle() {
    return deleteCardListTitleGlobal;
  }

  // END : Getters and Setters //

  static hideBoards() {
    document.getElementById('boardContainer').style.display = 'none';
  }

  static hideCardList() {
    document.getElementById('workplace').style.display = 'none';
  }

  static showBoards() {
    document.getElementById('boardContainer').style.display = 'block';
  }

  static showCardList() {
    document.getElementById('workplace').style.display = 'block';
  }

  static goToBoard() {
    Service.hideCardList();
    Service.showBoards();
  }

  static fetchTitle(e, ref, cardOrList) {
    // console.log(ref.textContent);
    const textareaId = document.getElementById('modify-title-area');
    textareaId.value = ref.textContent;

    Service.titleElementRef = ref;
    // console.log(Service.getTitleElementRef());

    const modalTitle = document.getElementById('title-modal');
    const modalDeleteText = document.getElementById('delete-title-submit');

    if (cardOrList === 'card') {
      Service.deleteCardTitle = true;
      Service.deleteCardListTitle = false;
      modalTitle.textContent = 'Modify Card Title / Delete Card';
      modalDeleteText.textContent = 'Delete Card';
    } else if (cardOrList === 'cardList') {
      Service.deleteCardTitle = false;
      Service.deleteCardListTitle = true;
      modalTitle.textContent = 'Modify Card-List Title / Delete Card-List';
      modalDeleteText.textContent = 'Delete Card-List';
    }

    // console.log("deleteCardTitle: "+this.deleteCardTitle);
    // console.log("deleteCardListTitle: "+ this.deleteCardListTitle);
  }

  static modifyTitle() {
    // console.log(this.titleElementRef.textContent);
    // console.log(document.getElementById('modify-title-area').value);
    Service.titleElementRef.textContent = document.getElementById('modify-title-area').value;
  }

  static deleteElement() {
    if (Service.deleteCardTitle === true) {
      Service.titleElementRef.parentNode.removeChild(Service.titleElementRef);
    } else if (Service.deleteCardListTitle === true) {
      Service.titleElementRef.parentNode.parentNode.parentNode.removeChild(Service.titleElementRef.parentNode.parentNode);
    }
  }

  static createHTMLElement(htmlString) {
    const template = document.createElement('template');
    template.innerHTML = htmlString;
    return template.content.firstElementChild;
  }

  static getLastBoardId() {
    const data = getData(boardsURL);
    // console.log(data);
    let lastBoardId = 0;
    if (data.length > 0) {
      lastBoardId = data[data.length - 1].id;
    }
    // console.log(lastBoardId);
    return lastBoardId;
  }

  static getLastCardListId() {
    const data = getData(cardListURL);
    // console.log(data);

    let lastCardListId = 0;
    // console.log(data.length);
    if (data.length > 0) {
      lastCardListId = data[data.length - 1].id;
      // console.log(lastCardListId);
    }

    return lastCardListId;
  }

  static getLastCardId() {
    const data = getData(cardsURL);
    // console.log(data);

    let lastCardId = 0;
    // console.log(data.length);
    if (data.length > 0) {
      lastCardId = data[data.length - 1].id;
      // console.log(lastCardId);
    }

    return lastCardId;
  }

  static deletePreviousSiblings(lastElementRef) {
    // iterate until we find an element node or there is no previous sibling
    while (lastElementRef.previousSibling != null) {
      lastElementRef.parentNode.removeChild(lastElementRef.previousSibling);
    }
  }
}
