const cardTemplate = document.querySelector("#card-template").content;

export function createCard({ name, link }, 
    { handleDelete, handleImageClick }) {
    const cardElement = cardTemplate.querySelector(".card").cloneNode(true);
    const cardImage = cardElement.querySelector(".card__image");
    const cardTitle = cardElement.querySelector(".card__title");
    const deleteButton = cardElement.querySelector(".card__delete-button");
    const likeButton = cardElement.querySelector(".card__like-button");

    if (cardImage) {
        cardImage.src = link;
        cardImage.alt = name;
        cardImage.addEventListener("click", () => handleImageClick({ name, link }));
    }
    if (cardTitle) cardTitle.textContent = name;
    if (deleteButton) deleteButton.addEventListener("click", () => handleDelete(cardElement));
    if (likeButton) {
        likeButton.addEventListener("click", () => {
            likeButton.classList.toggle("card__like-button_is-active");
        });
    }

    return cardElement;
}

export function handleDelete(cardElement) {
    cardElement.remove();
}