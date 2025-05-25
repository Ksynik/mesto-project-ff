const cardTemplate = document.querySelector("#card-template").content;

const places = document.querySelector(".places__list");

function createCard(cardData, deleteCard) {
    const cardElement = cardTemplate.querySelector(".card").cloneNode(true);
    const cardImage = cardElement.querySelector(".card__image");
    const cardTitle = cardElement.querySelector(".card__title");
    const deleteButton = cardElement.querySelector(".card__delete-button");
    const likeButton = cardElement.querySelector(".card__like-button");

    cardImage.src = cardData.link;
    cardImage.alt = cardData.name;
    cardTitle.textContent = cardData.name;

    deleteButton.addEventListener("click", () => {
        deleteCard(cardElement);
    });

    likeButton.addEventListener("click", () => {
        likeButton.classList.toggle("card__like-button_active");
    });

    return cardElement;
}

function deleteCard(cardElement) {
    cardElement.remove();
}

function renderCards(cards) {
    cards.forEach((cardData) => {
        const card = createCard(cardData, deleteCard);
        places.appendChild(card);
    });
}
renderCards(initialCards);