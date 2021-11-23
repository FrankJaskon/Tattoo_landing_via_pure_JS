import {createModalWindow, removeElement} from "./navigation";

function showContent(item) {
    item.classList.add('show', 'fade0_5s0s');
    item.classList.remove('hide');
    document.documentElement.style.overflow = 'hidden';
}

function closeModal(modal, dataAttribute, callback) {
    modal.addEventListener('click', (event) => {
        if (event.target.hasAttribute(dataAttribute)) {
            addSroll();

            if (callback) {
                callback();
            }
        }
    });
}

function closeModalByEscape(modal) {
    document.addEventListener('keyup', (e) => {
        if (e.code === 'Escape') {
            // hideContent(modal);
            removeElement(modal);
            addSroll();
        }
    });
}

function addSroll() {
    document.documentElement.style.overflow = '';
}

function hideContent(modal) {
    modal.classList.remove('show', 'fade0_5s0s');
    modal.classList.add('hide');
}

function viewModal(elements) {

    elements.forEach((item) => {
        item.addEventListener('click', () => {
            const modalContainer = createModalWindow(false, '.modal');

            modalContainer.innerHTML = `
                <div class="modal__box add__absolute">
                    <div data-close_modal class="close__modal add__cursor_pointer add__absolute">
                        &times;
                    </div>
                    <div class="modal__wrapper">
                        <h3 class="modal__title content__title">Мы свяжемся с вами в кратчайшие сроки</h3>
                        <form id="modal__form">
                            <div class="input__box padding-top_20px">
                                <input type="text" name="name" class="input__decoration"
                                    placeholder="Введи ваше Имя" required>
                            </div>
                            <div class="input__box">
                                <input type="tel" name="phone" class="input__decoration"
                                    placeholder="Телефон в формате +3(80)" required>
                            </div>
                            <button type="submit" class="content__button add__cursor_pointer">
                                Перезвонить мне
                            </button>
                        </form>
                    </div>
                </div>
            `;

            document.body.append(modalContainer);
            showContent(modalContainer);

            modalContainer.addEventListener('click', (e) => {
                if (e.target === modalContainer) {
                    addSroll();
                    removeElement(modalContainer);
                }
            });

            closeModal(modalContainer, 'data-close_modal', () => removeElement(modalContainer));
            closeModalByEscape(modalContainer);

            // Send requests

            const forms = document.querySelectorAll('form'),
                  message = {
                  loading: 'img/icons/spinner.svg',
                  success: 'Спасибо, что выбираете нас!',
                  failure: 'Что-то пошло не так...'
                  };

            forms.forEach(item => {
                postData(item);
            });

            function postData(form) {
                form.addEventListener('submit', (event) => {
                    event.preventDefault();

                    const statusMessage = document.createElement('img');
                    statusMessage.src = message.loading;
                    statusMessage.style.cssText = `
                        display: block;
                        margin: 0 auto;
                        width: 1rem;
                    `;
                    form.append(statusMessage);

                    const formData = new FormData(form),
                            additionalObject = {};

                    formData.forEach(function (key, value) {
                        additionalObject[key] = value;
                    });

                    fetch('server.php', {
                        method: 'POST',
                        headers: {
                            'Content-type': 'application/json'
                        },
                        body: JSON.stringify(additionalObject)
                    }).then(data => {
                        console.log(data);
                        statusMessage.remove();
                        showThanksModal(message.success);
                    }).catch(() => {
                        showThanksModal(message.failure);
                    }).finally(() => {
                        form.reset();
                    });
                });
            }

            function showThanksModal(textMessage) {
            const prevModalDialog = document.querySelector('.modal__box'),
                    modalWindow = document.querySelector('.modal');

            hideContent(prevModalDialog);

            const thanksModal = document.createElement('div');
            thanksModal.classList.add('modal__box', 'add__absolute');
            thanksModal.innerHTML = `
                <div data-close_modal class="close__modal add__cursor_pointer add__absolute">
                    &times;
                </div>
                <h3 class="modal__title content__title">${textMessage}</h3>
                `;
            modalWindow.append(thanksModal);

            setTimeout (() => {
                thanksModal.remove();
                showContent(prevModalDialog);
                removeElement(modalContainer);
                addSroll();
            }, 2000);
            }
        });
    });
}

function modal() {
     // Modal

    const dataModal = document.querySelectorAll('[data-show_modal]');
    // modalBox = document.querySelector('section.modal');

    // function viewModal(element, modal) {
    //     const modalContainer = createModalWindow(false, '.modal');

    //     element.forEach((item) => {
    //         item.addEventListener('click', () => {
    //             showContent(modal);
    //         });
    //     });
    // }

    // modalBox.addEventListener('click', (e) => {
    //     if (e.target === modalBox) {
    //         hideContent(e.target);
    //     }
    // });

    // closeModalByEscape(modalBox);
    // viewModal(document.querySelectorAll('.text__button'), modalBox);
    // viewModal(dataModal, modalBox);
    // closeModal(modalBox, 'data-close_modal');

    viewModal(document.querySelectorAll('.text__button'));
    viewModal(dataModal);
}

export default modal;
export {showContent, addSroll, closeModal, closeModalByEscape, viewModal};