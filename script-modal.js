"use strict";

document.addEventListener('DOMContentLoaded', () => {

    // Tabs

    const wrapperContent = document.querySelector('.wrapper-content'),
      content = wrapperContent.querySelectorAll('.content'),
      tabs = document.querySelectorAll('.tab'),
      parentTabs = document.querySelector('.parentTabs');

      function showTab (i = 0) {
        content[i].style.display = 'block';
        content[i].classList.add('fade');
        tabs[i].classList.add('active', 'fade');
      }

      function hideTabs () {
        content.forEach((item, i) => {
            item.style.display = 'none';
            item.classList.remove('fade');
            tabs[i].classList.remove('active', 'fade');
        });
    }

    hideTabs();
    showTab();

      parentTabs.addEventListener('click', (e) => {
        const target = e.target;

        if (target && target.classList.contains('tab')) {
            tabs.forEach((item, i) => {
                if (item == target) {
                    hideTabs();
                    showTab(i);
                }
            });
        }
    });

    // Modal

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
    class MakePriceCard {
        constructor(img, altimg, nameOfCard, content, checkingImgOrder, price, ...classes) {
            this.nameOfCard = nameOfCard;
            this.altimg = altimg;
            this.content = content;
            this.price = price;
            this.img = img;
            this.classes = classes;
            this.checkingImgOrder = checkingImgOrder;
        }
        render() {
            const newCard = document.createElement('div');

            if (this.checkingImgOrder === 'right' || this.checkingImgOrder === 'left') {
                newCard.style.cssText = `
                    flex: 1 480px;
                    display: flex;
                    flex-direction: row;
                    flex-shrink: 0;
                `;
            } else if (this.checkingImgOrder === 'top' || this.checkingImgOrder === 'bottom') {
                newCard.style.cssText = `
                    flex: 1 250px;
                    display: flex;
                    flex-direction: column;
                    flex-shrink: 0;
                `;
            } else console.log('Sorry, man. Something happens');

            if (this.checkingImgOrder === 'right' || this.checkingImgOrder === 'bottom') {
                this.checkingOreder = `inversion__order-item`;
            } else {
                this.checkingOreder = '';
            }

            newCard.innerHTML = `
                <div class="card__img ${this.checkingImgOrder}">
                    <img src="${this.img}" alt="${this.altimg}">
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

    axios.get('http://localhost:3000/menu')
        .then((response) => {
            response.data.forEach(({img, altimg, title, descr, imgpos, price}) => {
                new MakePriceCard(
                        img,
                        altimg,
                        title,
                        descr,
                        imgpos,
                        price
                    ).render();
            });
        }).then(() => {
            addSlidersAndHeightOfBackground(wrapperForCard);
            addRefrenceSubtitles();
        });


    // Bind subtittles with tabs
    
    function addRefrenceSubtitles () {
        const cardSubtitles = document.querySelectorAll('.tattoo__item-subtitle');

            cardSubtitles.forEach((item) => {
                item.addEventListener('click', (event) => {
                tabs.forEach((sometab, num) => {
                    if (event.target.innerHTML === sometab.innerHTML) {

                    hideTabs(); 
                    showTab(num);
                    scrollIntoViewTabNumb(num);
                    }
                });
            });
            function scrollIntoViewTabNumb(i) {
                content[i].scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        });
    }

    //  Add height of background and sliders for cards

    function addSlidersAndHeightOfBackground(parent) {
        const newSliderLeft = document.createElement('div'),
            newSliderRight = document.createElement('div');
      
            checkAndShowSliders();

             // Height of background 

            function setHeightOfBackground(classOfBackground) {
                const someBackground = document.querySelector(`.${classOfBackground}`);

                someBackground.style.height = (document.documentElement.scrollHeight)  + 'px';
            }

            setHeightOfBackground('background_box');


        function checkAndShowSliders (shiftLeft = parent.scrollLeft, 
            shiftRight = document.documentElement.offsetWidth - 175) {
                
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

                    if (timePassed >= document.body.offsetWidth/2) {
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

});