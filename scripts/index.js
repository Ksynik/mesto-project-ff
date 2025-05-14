const cardTemplate = document.getElementById("card-template").content;

const placesList = document.querySelector(".places__list");

function createCard(cardData, deleteCallback) {
    const cardElement = cardTemplate.querySelector(".card").cloneNode(true);
    const cardImage = cardElement.querySelector(".card__image");
    const cardTitle = cardElement.querySelector(".card__title");
    const deleteButton = cardElement.querySelector(".card__delete-button");
    const likeButton = cardElement.querySelector(".card__like-button");

    
