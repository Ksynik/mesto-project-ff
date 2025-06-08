import '../pages/index.css';
import { openModal, closeModal, setModalListeners } from '../components/modal.js';
import { createCard, handleDelete } from '../components/card.js';
import { enableValidation, clearValidation } from '../validation.js';
import { getUserInfo, addCard, updateAvatar, getInitialCards, addLike, removeLike } from '../api.js';

// DOM-элементы
const places = document.querySelector('.places__list');
const editPopup = document.querySelector('.popup_type_edit');
const addCardPopup = document.querySelector('.popup_type_new-card');
const imagePopup = document.querySelector('.popup_type_image');
const editButton = document.querySelector('.profile__edit-button');
const addButton = document.querySelector('.profile__add-button');
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const profileForm = document.forms['profile-form'];
const cardForm = document.forms['card-form'];
const avatarForm = document.forms['new-avatar'];
const nameInput = profileForm.querySelector('.popup__input_type_name');
const jobInput = profileForm.querySelector('.popup__input_type_description');
const cardNameInput = cardForm.querySelector('.popup__input_type_card-name');
const cardLinkInput = cardForm.querySelector('.popup__input_type_url');
const popupImage = document.querySelector('.popup__image');
const popupCaption = document.querySelector('.popup__caption');
const profileAvatar = document.querySelector('.profile__avatar');
const avatarImage = document.querySelector('.profile__image');
const avatarEditButton = document.querySelector('.profile__avatar-edit');
const avatarPopup = document.querySelector('.popup_type_new-avatar');

let isFormSubmitting = false;
let userId = '';

const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__input-error_active'
};

// --- Вспомогательные функции ---
function setButtonLoading(button, isLoading, loadingText = 'Сохранение...') {
  if (!button) return;
  if (isLoading) {
    button.dataset.originalText = button.textContent;
    button.textContent = loadingText;
    button.disabled = true;
  } else {
    button.textContent = button.dataset.originalText || 'Сохранить';
    button.disabled = false;
  }
}

function updateProfileInfo({ name, about, avatar, _id }) {
  profileTitle.textContent = name;
  profileDescription.textContent = about;
  if (avatarImage) avatarImage.style.backgroundImage = `url(${avatar})`;
  if (profileAvatar) profileAvatar.src = avatar;
  userId = _id;
}

function handleCardImageClick({ name, link }) {
  document.querySelectorAll('.popup_opened').forEach(popup => closeModal(popup));
  popupImage.src = link;
  popupImage.alt = name;
  popupCaption.textContent = name;
  openModal(imagePopup);
}

function handleLike({ cardId, likeButton, likeCountElement }) {
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
}

// --- Обработчики форм ---
function handleEditFormSubmit(evt) {
  evt.preventDefault();
  const submitButton = profileForm.querySelector(validationConfig.submitButtonSelector);
  setButtonLoading(submitButton, true);

  getUserInfo({
    name: nameInput.value,
    about: jobInput.value
  })
    .then(updateProfileInfo)
    .then(() => closeModal(editPopup))
    .catch(console.error)
    .finally(() => setButtonLoading(submitButton, false));
}

function handleAddCardFormSubmit(evt) {
  evt.preventDefault();
  if (isFormSubmitting) return;
  isFormSubmitting = true;
  const submitButton = cardForm.querySelector(validationConfig.submitButtonSelector);
  setButtonLoading(submitButton, true);

  const name = cardNameInput.value.trim();
  const link = cardLinkInput.value.trim();

  addCard({ name, link })
    .then(cardData => {
      const card = createCard(cardData, {
        handleDelete,
        handleImageClick: handleCardImageClick,
        handleLike, 
        userId
      });
      places.prepend(card);
      cardForm.reset();
      closeModal(addCardPopup);
    })
    .catch(console.error)
    .finally(() => {
      setButtonLoading(submitButton, false);
      isFormSubmitting = false;
    });
}

function handleAvatarFormSubmit(evt) {
  evt.preventDefault();
  const submitButton = avatarForm.querySelector(validationConfig.submitButtonSelector);
  setButtonLoading(submitButton, true);

  const avatarInput = avatarForm.querySelector('.popup__input_type_url');
  const avatarUrl = avatarInput.value.trim();

  updateAvatar(avatarUrl)
    .then(updateProfileInfo)
    .then(() => {
      closeModal(avatarPopup);
      avatarForm.reset();
    })
    .catch(err => console.error('Ошибка при обновлении аватара:', err))
    .finally(() => setButtonLoading(submitButton, false));
}

// --- Инициализация ---
function handleEditButtonClick() {
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
  clearValidation(profileForm, validationConfig);
  openModal(editPopup);
}

function handleAddButtonClick() {
  clearValidation(cardForm, validationConfig);
  openModal(addCardPopup);
}

function handleAvatarEditButtonClick() {
  clearValidation(avatarForm, validationConfig);
  openModal(avatarPopup);
}

avatarEditButton.addEventListener('click', handleAvatarEditButtonClick);

editButton?.addEventListener('click', handleEditButtonClick);
addButton?.addEventListener('click', handleAddButtonClick);
profileForm?.addEventListener('submit', handleEditFormSubmit);
cardForm.addEventListener('submit', handleAddCardFormSubmit);
avatarForm?.addEventListener('submit', handleAvatarFormSubmit);

enableValidation(validationConfig);
clearValidation(profileForm, validationConfig);
clearValidation(cardForm, validationConfig);
clearValidation(avatarForm, validationConfig);
setModalListeners();

// --- Загрузка данных ---
Promise.all([getUserInfo(), getInitialCards()])
  .then(([user, cards]) => {
    updateProfileInfo(user);
    renderCards(cards);
  })
  .catch(console.error);

function renderCards(cards) {
  places.innerHTML = '';
  cards.forEach(cardData => {
    const card = createCard(cardData, {
      handleDelete,
      handleImageClick: handleCardImageClick,
      handleLike, // ← обязательно передайте эту функцию!
      userId
    });
    places.append(card);
  });
}
