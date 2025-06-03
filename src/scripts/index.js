import '../pages/index.css';
import { initialCards } from './cards.js';
import { openModal, closeModal, setModalListeners } from '../components/modal.js';
import { createCard, handleDelete } from '../components/card.js';

const places = document.querySelector('.places__list');
const editPopup = document.querySelector('.popup_type_edit');
const addCardPopup = document.querySelector('.popup_type_new-card');
const imagePopup = document.querySelector('.popup_type_image');
const editButton = document.querySelector('.profile__edit-button');
const addButton = document.querySelector('.profile__add-button');
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const profileForm = document.forms["profile-form"];
const cardForm = document.forms["card-form"];
const nameInput = profileForm.querySelector('.popup__input_type_name');
const jobInput = profileForm.querySelector('.popup__input_type_description');
const cardNameInput = cardForm.querySelector('.popup__input_type_card-name');
const cardLinkInput = cardForm.querySelector('.popup__input_type_url');
const popupImage = document.querySelector('.popup__image');
const popupCaption = document.querySelector('.popup__caption');

function handleEditButtonClick() {
    nameInput.value = profileTitle.textContent;
    jobInput.value = profileDescription.textContent;
    openModal(editPopup);
}

function handleEditFormSubmit(evt) {
    evt.preventDefault();
    profileTitle.textContent = nameInput.value;
    profileDescription.textContent = jobInput.value;
    closeModal(editPopup);
}

function handleAddButtonClick() {
    openModal(addCardPopup);
}

function handleAddCardFormSubmit(evt) {
    evt.preventDefault();

    const name = cardNameInput.value.trim();
    const link = cardLinkInput.value.trim();

    if (!name || !link) return;

    const cardData = { name, link };
    const card = createCard(cardData, {
        handleDelete,
        handleImageClick: handleCardImageClick
    });

    if (card) {
        places.prepend(card);
        cardForm.reset();
        closeModal(addCardPopup);
    }
}

function handleCardImageClick(cardData) {
    popupImage.src = cardData.link;
    popupImage.alt = cardData.name;
    popupCaption.textContent = cardData.name; 
    openModal(imagePopup);
}

function renderCard(cardData, insertMethod = "prepend") {
    const cardElement = createCard(cardData, {
        handleDelete,
        handleImageClick: handleCardImageClick
    });
    if (typeof places[insertMethod] === "function") {
        places[insertMethod](cardElement);
    } else {
        places.prepend(cardElement);
    }
}

function renderCards(cards, insertMethod = "appendChild") {
    places.innerHTML = '';
    cards.forEach(cardData => renderCard(cardData, insertMethod));
}

editButton.addEventListener('click', handleEditButtonClick);
profileForm.addEventListener('submit', handleEditFormSubmit);
addButton.addEventListener('click', handleAddButtonClick);
cardForm.addEventListener('submit', handleAddCardFormSubmit);

setModalListeners();
renderCards(initialCards);