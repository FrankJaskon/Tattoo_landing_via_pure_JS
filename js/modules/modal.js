function modal() {
     // Modal

    const dataModal = document.querySelectorAll('[data-show_modal]'),
    modalBox = document.querySelector('section.modal');

    function showContent(item = modalBox) {
        item.classList.add('show', 'fade0_5s0s');
        item.classList.remove('hide');
        document.documentElement.style.overflow = 'hidden';
    }

    function hideContent(item) {
        item.classList.remove('show', 'fade0_5s0s');
        item.classList.add('hide');
        addSroll();
    }

    function addSroll() {
        document.documentElement.style.overflow = '';
    }

    function viewModal(selector, modal) {
        selector.forEach((item) => {
            item.addEventListener('click', () => {
                showContent(modal);
            });
        });
    }

    function closeModal(modal) {
        modal.addEventListener('click', (event) => {
            if (event.target.hasAttribute('data-close_modal')) {
                hideContent(modal);
                addSroll();
            }
        });
    }

    modalBox.addEventListener('click', (e) => {
        if (e.target === modalBox) {
            hideContent(e.target);
        }
    });

    document.addEventListener('keyup', (e) => {
        if (modalBox.classList.contains('show') && e.code === 'Escape') {
            hideContent(modalBox);
        }
    });

    viewModal(document.querySelectorAll('.top__panel_button'), modalBox);
    viewModal(dataModal, modalBox);
    closeModal(modalBox);

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
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                                            display: block; 
                                            margin: 0 auto;
                                            width: 15px;
                                        `;
            form.append(statusMessage);

            const formData = new FormData(form);

            const additionalObject = {};
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

        showContent(modalWindow);
        hideContent(prevModalDialog);

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__box', 'add__absolut');
        thanksModal.innerHTML = `
            <div data-close_modal class="close__modal add_cursor-pointer add__absolut">
                &times;
            </div>
            <h3 class="modal__title content__title">${textMessage}</h3>
            `;
        modalWindow.append(thanksModal);

        setTimeout (() => {
            thanksModal.remove();
            showContent(prevModalDialog);
            hideContent(modalBox);
        }, 2000);
    }
}

export default modal;