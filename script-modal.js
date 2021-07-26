"use strict";

//  Modal

document.addEventListener('DOMContentLoaded', () => {

    const dataModal = document.querySelectorAll('[data-show_modal]'),
        modalBox = document.querySelector('section.modal');

    function showContentWithAnimation(item = modalBox) {
        item.classList.add('show', 'fade');
        item.classList.remove('hide');
        addSroll();
    }

    function showContentSansAnimation(item) {
        item.classList.remove('hide');
        item.classList.add('show');
    }

    function hideContent(item) {
        item.classList.remove('show', 'fade');
        item.classList.add('hide');
    }

    function addSroll() {
        document.body.style.overflow = '';
    }

    function viewModal(selector, modal) {
        selector.forEach((item) => {
            item.addEventListener('click', () => {
                showContentWithAnimation(modal);
                document.body.style.overflow = 'hidden';
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
            addSroll();
        }
    });

    document.addEventListener('keyup', (e) => {
        if (modalBox.classList.contains('show') && e.code === 'Escape') {
            hideContent(modalBox);
            addSroll();
        }
    });

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
        const prevModalDialog = document.querySelector('.modal_box'),
              modalWindow = document.querySelector('.modal');

        showContentWithAnimation(modalWindow);
        hideContent(prevModalDialog);

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal_box', 'add_absolut');
        thanksModal.innerHTML = `
            <div data-close_modal class="close_modal add_cursor-pointer add_absolut">
                &times;
            </div>
            <h3 class="modal_subtitles">${textMessage}</h3>
            `;
        modalWindow.append(thanksModal);

        setTimeout (() => {
            thanksModal.remove();
            showContentWithAnimation(prevModalDialog);
            hideContent(modalBox);
        }, 4000);
    }

    // Construct priceCards

    const wrapperForCard = document.querySelector('div.wrapper__price-cards');

    class MakePriceCardVertical {
        constructor(nameOfCard, width, height, content, price, img, ...classes) {
            this.width = width;
            this.height = height;
            this.nameOfCard = nameOfCard;
            this.content = content;
            this.price = price;
            this.img = img;
            this.classes = classes;
        }
        render() {
            const newCard = document.createElement('div');

            newCard.style.cssText = `
                width: ${this.width};
                height: ${this.height};
                flex-shrink: 0;
            `;

            newCard.innerHTML = `
                <div class="card__img-vertical">
                    <img src="img/Tattoo-styles/${this.img}" alt="${this.img}">
                </div>
                <h3 class="tattoo__item-subtitle add_cursor-pointer">${this.nameOfCard}</h3>
                <div class="tattoo__item-descr">
                    ${this.content}
                </div>
                <div class="tattoo__item-divider"></div>
                <div class="tattoo__item-price">
                    <div class="tattoo__item-cost">
                        Цена:
                    </div>
                    <div class="tattoo__item-total">
                        <span>от ${this.price}</span> грн
                    </div>
                </div>`;
            if (this.classes.length === 0) {
                this.classes[0] = 'box__price-card';
            }
            this.classes.forEach(item => {
                newCard.classList.add(item);
            });
            wrapperForCard.append(newCard);
        }
    }

    class MakePriceCardGorizontal {
        constructor(nameOfCard, width, height, content, price, img, checkingOreder, ...classes) {
            this.width = width;
            this.height = height;
            this.nameOfCard = nameOfCard;
            this.content = content;
            this.price = price;
            this.img = img;
            this.classes = classes;
            this.checkingOreder = checkingOreder;
        }
        render() {
            const newCard = document.createElement('div');

            newCard.style.cssText = `
                width: ${this.width};
                height: ${this.height};
                display: flex;
                flex-shrink: 0;
            `;
            if (this.checkingOreder == 'inversion') {
                this.checkingOreder = `inversion__order-item`;
            } else {
                this.checkingOreder = '';
            }

            newCard.innerHTML = `
                <div class="card__img-gorizontal ${this.checkingOreder}">
                    <img src="img/Tattoo-styles/${this.img}" alt="${this.img}">
                </div>
                <div class="card__content-wrapper">
                    <h3 class="tattoo__item-subtitle add_cursor-pointer">${this.nameOfCard}</h3>
                    <div class="tattoo__item-descr">
                        ${this.content}
                    </div>
                    <div class="tattoo__item-divider"></div>
                    <div class="tattoo__item-price">
                        <div class="tattoo__item-cost">
                            Цена:
                        </div>
                        <div class="tattoo__item-total">
                            <span>от ${this.price}</span> грн
                        </div>
                    </div>
                </div>`;


            if (this.classes.length === 0) {
                this.classes[0] = 'box__price-card';
            }
            this.classes.forEach(item => {
                newCard.classList.add(item);
            });
            wrapperForCard.append(newCard);
        }
    }

    // const newPriceCardScetch = new MakePriceCardGorizontal(
    //     'Скетч',
    //     '500px',
    //     '370px',
    //     'Благодаря татуировке в стиле Скетч никто не осмелится назвать тебя неоригинальным.',
    //     1500,
    //     'scetch-mini.jpg',
    //     'normal'
    // );
    // newPriceCardScetch.render();

    // const newPriceCardMinimalism = new MakePriceCardVertical(
    //     'Минимализм',
    //     '300px',
    //     '370px',
    //     'Маленькая татуировка - минимум элементов, максимум эффектности.',
    //     300,
    //     'minimalism-mini.jpg'
    // );
    // newPriceCardMinimalism.render();

    // const newPriceCardGraphics = new MakePriceCardGorizontal(
    //     'Графика',
    //     '500px',
    //     '370px',
    //     'Один из древнейших стилей, который никогда не устаривает. Лучшее выражение себя через утончённое изящество линий.',
    //     1300,
    //     'graphics-mini.png',
    //     'inversion'
    // );
    // newPriceCardGraphics.render();

    // const newPriceCardMiniature = new MakePriceCardVertical(
    //     'Миниатюра',
    //     '270px',
    //     '370px',
    //     'Ни для кого не секрет, что простота - вершина мастерства',
    //     500,
    //     'miniature-mini.png'
    // );
    // newPriceCardMiniature.render();


    // const newPriceCardMinimalismClone = new MakePriceCardVertical(
    //     'Минимализм',
    //     '300px',
    //     '370px',
    //     'Маленькая татуировка - минимум элементов, максимум эффектности.',
    //     300,
    //     'minimalism-mini.jpg'
    // );
    // newPriceCardMinimalismClone.render();

    // const newPriceCardMiniatureClone = new MakePriceCardGorizontal(
    //     'Цветы',
    //     '510px',
    //     '370px',
    //     'Цветы - отличный атрибут, чтобы запечатлить их красоту навеки.',
    //     800,
    //     'flowers.jpg',
    //     'inversion'
    // );
    // newPriceCardMiniatureClone.render();

    //  Add sliders for cards

    function addSliders(parent) {
        const newSliderLeft = document.createElement('div'),
            newSliderRight = document.createElement('div');
        // let steps = 0,
        //     keeperScrollWidth = 0;

        setTimeout(() => {
      
            checkAndShowSliders();

             // Height of background 

            function setHeightOfBackground(classOfBackground) {
                const someBackground = document.querySelector(`.${classOfBackground}`);

                someBackground.style.height = (document.documentElement.scrollHeight)  + 'px';
            }

            setHeightOfBackground('background_box');

        }, 80);

        function checkAndShowSliders (shiftLeft = parent.scrollLeft, shiftRight = document.documentElement.offsetWidth - 175) {
            if (parent.scrollHeight > parent.offsetHeight || parent.scrollWidth > parent.offsetWidth) {

                newSliderLeft.innerHTML = `<img src="img/icons/slider-left.png">`;
                newSliderRight.innerHTML = `<img src="img/icons/slider-right.png">`;

                newSliderLeft.classList.add('sliders_cards', 'slider_left', 'add_absolut');
                newSliderRight.classList.add('sliders_cards', 'slider_right', 'add_absolut');

                newSliderLeft.style.left = Math.floor(shiftLeft) + 'px';
                newSliderRight.style.left = Math.floor(shiftRight) + 'px';

                parent.append(newSliderLeft);
                parent.append(newSliderRight);
            }
        }

        function moveLeft(timePassed) {
            parent.scrollLeft = parent.scrollLeft - timePassed/10;
        }
        function moveRight(timePassed) {
            parent.scrollLeft = parent.scrollLeft + timePassed/10;
        }

        function removeSliders() {
            newSliderLeft.remove();
            newSliderRight.remove();
        }

            parent.addEventListener('mousedown', (event) => {
                if (event.target && event.target.parentElement.classList.contains('sliders_cards')) {

                let start = Date.now(),
                timer = setInterval(function() {
                    let timePassed = Date.now() - start;

                    if (timePassed >= parent.scrollWidth - document.documentElement.offsetWidth) {
                        clearInterval(timer); 
                        checkAndShowSliders(parent.scrollLeft, parent.scrollLeft + document.documentElement.offsetWidth - 175);
                        return;
                    }
                    
                        if (event.target.parentElement.classList.contains('slider_left')) {
                            moveLeft(timePassed);
                        } else {
                            moveRight(timePassed);
                        }
              

                    removeSliders();

                    }, 20);
            }
          });
    }
    addSliders(wrapperForCard);

});

    //     newSliderLeft.addEventListener('mousedown', () => {
    //         showContentWithAnimation(newSliderRight);
    //         const countTime = setInterval(() => {
    //             if (parent.scrollLeft > 25) {
    //                 parent.scrollLeft = parent.scrollLeft - 4;
    //                 steps -= 4.455;
    //                 newSliderLeft.style.left = steps + 'px';
    //                 newSliderRight.style.right = -steps + 'px';
    //             } else {
    //                 hideContent(newSliderLeft);
    //             }
    //         }, 12);
    //         newSliderLeft.addEventListener('mouseup', () => {
    //             clearInterval(countTime);
    //         });
    //         newSliderLeft.addEventListener('mouseout', () => {
    //             clearInterval(countTime);
    //         });
    //     });