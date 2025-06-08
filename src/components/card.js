import { addLike, removeLike, deleteCard } from '../api.js';

const cardTemplate = document.querySelector("#card-template").content;

export function createCard({ name, link, likes, owner, _id }, 
{ handleDelete, handleImageClick, userId }) {
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const deleteButton = cardElement.querySelector(".card__delete-button");
  const likeButton = cardElement.querySelector(".card__like-button");
  const likeCountElement = cardElement.querySelector('.card__like-count');
  const cardId = _id; 

  cardImage.onclick = null;
    if (deleteButton) deleteButton.onclick = null;
    if (likeButton) likeButton.onclick = null;

  if (cardImage) {
    cardImage.src = link;
    cardImage.alt = name;
    cardImage.addEventListener("click", () => handleImageClick({ name, link }));
  }
  if (cardTitle) cardTitle.textContent = name;

  if (owner && owner._id === userId) {
    if (deleteButton) {
      deleteButton.addEventListener("click", () => handleDelete(cardId, cardElement));
      deleteButton.style.display = "";
    }
  } else {
    if (deleteButton) {
      deleteButton.style.display = "none";
    };
  };

  const isLiked = likes.some(user => user._id === userId);
  if (isLiked) {
    likeButton.classList.add("card__like-button_is-active");
  }
  likeCountElement.textContent = likes.length;

  likeButton.addEventListener("click", () => {
    const liked = likeButton.classList.contains("card__like-button_is-active");
    const apiMethod = liked ? removeLike : addLike;
    apiMethod(cardId)
      .then(updatedCard => {
        likeCountElement.textContent = updatedCard.likes.length;
        if (updatedCard.likes.some(user => user._id === userId)) {
          likeButton.classList.add("card__like-button_is-active");
        } else {
          likeButton.classList.remove("card__like-button_is-active");
        }
      })
      .catch(console.error);
  });

  return cardElement;
};

export function handleDelete(cardId, cardElement) {
  deleteCard(cardId)
    .then(() => {
      cardElement.remove();
    })
    .catch(console.error);
}