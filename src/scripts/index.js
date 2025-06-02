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
const editForm = editPopup.querySelector('.popup__form');
const nameInput = editForm.querySelector('.popup__input_type_name');
const jobInput = editForm.querySelector('.popup__input_type_description');
const addCardForm = addCardPopup.querySelector('.popup__form');
const cardNameInput = addCardForm.querySelector('.popup__input_type_card-name');
const cardLinkInput = addCardForm.querySelector('.popup__input_type_url');


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
    addCardForm.reset();
    openModal(addCardPopup);
}

function handleAddCardFormSubmit(evt) {
    evt.preventDefault();

    const name = cardNameInput.value.trim();
    const link = cardLinkInput.value.trim();

    if (!name || !link) return;

    const cardData = { name, link };
    const card = createCard(cardData, handleDelete, handleCardImageClick);

    if (card) {
        places.prepend(card);
        addCardForm.reset();
        closeModal(addCardPopup);
    }
}

function handleCardImageClick(cardData) {
    const popupImage = imagePopup.querySelector('.popup__image');
    const popupCaption = imagePopup.querySelector('.popup__caption');
    popupImage.src = cardData.link;
    popupImage.alt = cardData.name;
    popupCaption.textContent = cardData.name;
    openModal(imagePopup);
}


function renderCards(cards) {
    places.innerHTML = '';
    cards.forEach(cardData => {
        const card = createCard(cardData, handleDelete, handleCardImageClick);
        places.appendChild(card);
    });
}


editButton.addEventListener('click', handleEditButtonClick);
editForm.addEventListener('submit', handleEditFormSubmit);
addButton.addEventListener('click', handleAddButtonClick);
addCardForm.addEventListener('submit', handleAddCardFormSubmit);

setModalListeners();
renderCards(initialCards);