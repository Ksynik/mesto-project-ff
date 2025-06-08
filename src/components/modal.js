let openModalsCount = 0;

const handleEscKeyUp = (e) => {
  if (e.key === 'Escape') {
    const openedPopup = document.querySelector('.popup_is-opened');
    if (openedPopup) {
      closeModal(openedPopup);
    }
  }
};

export const openModal = (modal) => {
  if (!modal.classList.contains('popup_is-opened')) {
    modal.classList.add('popup_is-animated'); 
    setTimeout(() => {
      modal.classList.add('popup_is-opened'); 
    }, 10); 
    openModalsCount++;
    if (openModalsCount === 1) {
      document.addEventListener('keydown', handleEscKeyUp);
    }
  }
};

export const closeModal = (modal) => {
  modal.classList.remove('popup_is-opened'); 
  setTimeout(() => {
    modal.classList.remove('popup_is-animated'); 
  }, 300); 
  openModalsCount = Math.max(0, openModalsCount - 1);
  if (openModalsCount === 0) {
    document.removeEventListener('keydown', handleEscKeyUp);
  }
};

export const setModalListeners = (modal) => {
  const modals = modal ? [modal] : document.querySelectorAll('.popup');
  modals.forEach(setupModal);
};

function setupModal(modal) {
  const closeButton = modal.querySelector('.popup__close');
  if (closeButton) {
    closeButton.addEventListener('click', () => closeModal(modal));
  }
  modal.addEventListener('mousedown', (e) => {
    if (e.target === modal) {
      closeModal(modal);
    }
  });
}

const avatarPopup = document.querySelector('.popup_type_new-avatar');
