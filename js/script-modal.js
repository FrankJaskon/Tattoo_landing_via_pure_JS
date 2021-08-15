"use strict";

document.addEventListener('DOMContentLoaded', () => {
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
        thanksModal.classList.add('modal_box', 'add__absolut');
        thanksModal.innerHTML = `
            <div data-close_modal class="close_modal add_cursor-pointer add__absolut">
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

    const wrapperForCard = document.querySelector('.additional__wrapper_price-card');
    class MakePriceCard {
        constructor(img, altimg, nameOfCard, content, checkingImgOrder, price, orderNum, ...classes) {
            this.nameOfCard = nameOfCard;
            this.altimg = altimg;
            this.content = content;
            this.price = price;
            this.img = img;
            this.classes = classes;
            this.checkingImgOrder = checkingImgOrder;
            this.orderNum = orderNum;
        }
        render() {
            const newCard = document.createElement('div');

            console.log(this.orderNum);

            if (this.checkingImgOrder === 'right' || this.checkingImgOrder === 'left') {
                newCard.style.cssText = `
                    width: 470px;
                    display: flex;
                    flex-direction: row;
                `;
            } else if (this.checkingImgOrder === 'top' || this.checkingImgOrder === 'bottom') {
                newCard.style.cssText = `
                    width: 270px;
                `;
                newCard.classList.add('card-vertical');
            }

            if (this.checkingImgOrder === 'right' || this.checkingImgOrder === 'bottom') {
                this.checkingImgOrder = `inversion__order-item`;
            } else {
                this.checkingImgOrder = '';
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
                this.classes[0] = 'box__price_card';
            }
            this.classes.forEach(item => {
                newCard.classList.add(item);
            });
            {
                const boxes = wrapperForCard.querySelectorAll('.inner__box');

                for (let i = 0; i < boxes.length; i++) {
                    if (boxes[i].querySelectorAll('.box__price_card').length != 3) {
                        boxes[i].append(newCard);
                        break;
                    }
                }
            }
        }
    }

    axios.get('http://localhost:3000/menu')
        .then((response) => {
            const count = Math.ceil(response.data.length / 3);
            for (let i = 0; i < count; i++) {
                const innerBox = document.createElement('div');
                innerBox.classList.add('inner__box');
                wrapperForCard.append(innerBox);
            }
            wrapperForCard.style.width = window.getComputedStyle(wrapperForCard.querySelector('.inner__box'))
            .width.replace(/px||em||rm/, '') * count;
            wrapperForCard.style.transition = '1.5s all';

            response.data.forEach(({img, altimg, title, descr, imgpos, price, orderNum}) => {
                new MakePriceCard(
                        img,
                        altimg,
                        title,
                        descr,
                        imgpos,
                        price,
                        orderNum
                    ).render();
            });
        }).then(() => {
            setTimeout(() => {
                addRefrenceSubtitles();
            }, 100);
        }).then(() => {
            scrollCards();
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

    // scroll cards animation

    function scrollCards() {
        const mainWrapper = document.querySelector('.wrapper__price-cards'),
            additionalWrapper = document.querySelector('.additional__wrapper_price-card'),
            sliderLeft = document.querySelector('.slider_left'),
            sliderRight = document.querySelector('.slider_right'),
            itemsBoxes = document.querySelectorAll('.inner__box'),
            itemWidth = window.getComputedStyle((itemsBoxes[0])).width.replace(/px|em|rm/, '');

        sliderLeft.style.transition = '1s all';
        sliderRight.style.transition = '1s all';

        let positionNum = 0;

        mainWrapper.addEventListener('mousedown', (event) => {
            if (event.target && event.target.parentElement.classList.contains('sliders_cards')) {

                if (event.target.parentElement.classList.contains('slider_left')) {
                    moveLeft();
                } else {
                    moveRight();
                }
            }
        });

        moveTo();

        function moveTo() {
            const offset = positionNum * itemWidth;
            additionalWrapper.style.transform = `translateX(-${offset}px)`;
        }

        function moveLeft() {

            if (positionNum != 0) {
                positionNum--;
            } else {
                positionNum = (itemsBoxes.length - 1);
            }
            moveTo();
        }
        function moveRight() {

            if (positionNum != itemsBoxes.length - 1) {
                positionNum++;
            } else {
                positionNum = 0;
            }
            moveTo();
        }
        // function moveLeft() {
        //     if (mainWrapper.scrollLeft > widthWindow) {
        //         last = 0;
        //         if (mainWrapper.scrollLeft > widthWindow * check) {
        //         sliderRight.style.opacity = 1;
        //         step++;
        //         mainWrapper.scrollLeft = mainWrapper.scrollLeft - step;
        //         console.log('left 1', mainWrapper.scrollLeft);
        //         requestAnimationFrame(moveLeft);
        //         } 
        //     } else if (last) {
        //         if (Math.floor(mainWrapper.scrollLeft)) {
        //             step++;
        //             mainWrapper.scrollLeft = mainWrapper.scrollLeft - step;
        //             console.log('left 2', mainWrapper.scrollLeft);
        //             requestAnimationFrame(moveLeft);
        //         } else {
        //             console.log('left 3', mainWrapper.scrollLeft);
        //             sliderLeft.style.opacity = 0;
        //         }
        //     }
        // }
        // function moveRight() {
        //     if (window.getComputedStyle(wrapperForCard) - mainWrapper.scrollLeft - widthWindow >= widthWindow) {
        //         last = 0;
        //         console.log('before', step);
        //         if (mainWrapper.scrollLeft < widthWindow * check) {
        //             sliderLeft.style.opacity = 1;
        //             step++;
        //             mainWrapper.scrollLeft = mainWrapper.scrollLeft + step;
        //             console.log('right 1', mainWrapper.scrollLeft);
        //             requestAnimationFrame(moveRight);
        //         } 
        //     } else if (last) {
        //         if (Math.ceil(mainWrapper.scrollLeft + widthWindow) < window.getComputedStyle(wrapperForCard)) {
        //             step++;
        //             mainWrapper.scrollLeft = mainWrapper.scrollLeft + step;
        //             console.log('right 2', mainWrapper.scrollLeft);
        //             requestAnimationFrame(moveRight);
        //         } else {
        //             console.log('right 3', mainWrapper.scrollLeft);
        //             sliderRight.style.opacity = 0;
        //         }
        //     } 
        // }
        // function moveRight() {
        //     let check = 2;
        //     console.log(containerAllWidth - additionalWrapper.scrollLeft - widthWindow, containerAllWidth, step, widthWindow, additionalWrapper.scrollLeft);
        //     if (containerAllWidth - additionalWrapper.scrollLeft - widthWindow >= widthWindow) {
        //         console.log('F', additionalWrapper.scrollLeft);
        //         step++;
        //         additionalWrapper.scrollLeft = additionalWrapper.scrollLeft + step;
        //         requestAnimationFrame(moveRight);
        //     } else if (Math.ceil(additionalWrapper.scrollLeft + widthWindow) < containerAllWidth) {
        //         console.log('D', additionalWrapper.scrollLeft);
        //         step++;
        //         additionalWrapper.scrollLeft = additionalWrapper.scrollLeft + step;
        //         requestAnimationFrame(moveRight);
        //     }
        // } 
    }

    // intro gallary

    function addImgesDB({container, content, preview}) {
        const gallarySection = document.querySelector(container),
              images = document.querySelector(content),
              width = window.getComputedStyle(images).width.replace(/px|em|rm/, ''),
              previewOfImages = document.querySelector(preview);

            //   addImgesDB('.gallary', '.wrapper-view_img', '.wrapper__preview_imges');
            //   addImgesDB(arr);
            //   const arr = {
            //     container: '.gallary',
            //     content: '.wrapper-view_img',
            //     preview: '.wrapper__preview_imges'
            //   };


        // Addit cards

        axios.get('http://localhost:3000/gallary')
            .then((response) => {

                images.style.width = response.data.length * 100 + '%';
                images.classList.add('add__flex');
                images.style.transition = '1.5s all';
                
                gallarySection.style.overflow = 'hidden';

                let imgId = 0;

                response.data.forEach(({img, altimg}) => {
                    images.innerHTML += `
                        <div class="gallary__wrap_img"">
                            <img src="${img}" alt="${altimg}">
                        </div>
                    `;
                    previewOfImages.innerHTML += `
                        <div class="gallary__wrap_preview_img">
                            <img src="${img.replace(/\./, '-mini.')}" alt="${altimg}-mini" id="${'prevImg' + imgId++}">
                        </div>
                    `;
                });

                // Add slider

                // let previousImg = Math.floor(Math.random() * 10);
                let previousImg = 0;

                showGallaryImg(previousImg);

                function showGallaryImg (next) {
                    const icons = document.querySelectorAll('.gallary__wrap_preview_img > img');

                    let intervalOfAutoGallary = setTimeout(function showNextImg () {
                        moveOneStepRight();
                        intervalOfAutoGallary = setTimeout(showNextImg, 7000);
                    }, 7000);

                    window.addEventListener('visibilitychange', () => {
                        if (document.visibilityState === 'hidden') {
                            clearTimeout(intervalOfAutoGallary);
                        }
                    });

                    moveToImg(next);

                    function addActiveStatus(next, previous) {
                        icons[previous].parentElement.classList.remove('active__prev_img');
                        icons[next].parentElement.classList.add('active__prev_img');
                    }

                    function moveToImg(next) {
                        const absSlides = Math.abs(previousImg - next);

                        let offset = next * width;

                        if (absSlides <= 9) {
                            images.style.transition = `${absSlides * 0.5}s all`;
                        } else {
                            images.style.transition = '5s all';
                        }

                        images.style.transform = `translateX(-${offset}px)`;
                        addActiveStatus(next, previousImg);
                        previousImg = next;
                    }
                    
                    previewOfImages.addEventListener('click', (event) => {
                        const target = event.target;
    
                        if (target && target.parentElement.classList.contains('gallary__wrap_preview_img')) {
                            const id = +target.getAttribute('id').slice(7);

                            clearTimeout(intervalOfAutoGallary);
                            next = id;
                            moveToImg(next);
                        }
                    });

                    const arrowLeft = document.querySelector('.gallary__slider_left'),
                          arrowRight = document.querySelector('.gallary__slider_right');

                    arrowLeft.addEventListener('click', () => {
                        clearTimeout(intervalOfAutoGallary);
                        moveOneStepLeft();
                    });
                    arrowRight.addEventListener('click', () => {
                        clearTimeout(intervalOfAutoGallary);
                        moveOneStepRight();
                    });

                    function moveOneStepLeft() {
                        if (next == 0) {
                            next = icons.length - 1;
                            moveToImg(next);
                        } else {
                            moveToImg(--next);
                        }
                    }

                    function moveOneStepRight() {
                        if (next + 1 == icons.length) {
                            next = 0;
                            moveToImg(next);
                        } else {
                            moveToImg(++next);
                        }
                    }
                }
            });
    }

    // addImgesDB();

    const arr = {
        container: '.gallary',
        content: '.wrapper-view_img',
        preview: '.wrapper__preview_imges'
      };
    addImgesDB(arr);
              

});

// previewOfImages.addEventListener('click', (event) => {
//     const target = event.target;

//     if (target && target.parentElement.classList.contains('gallary__wrap_preview_img')) {
//         const id = target.getAttribute('id').slice(7),
//               width = widthItem.slice(0, widthItem.length - 2),
//               icons = document.querySelectorAll('.gallary__wrap_preview_img > img');

//         let offset = id * width - 1;

        
//         icons[showedItem].classList.remove('active__prev_img');
//         target.classList.add('active__prev_img');
        

//         console.log(Math.abs(showedItem - id));

//         images.style.transition = '1.5s all';

//         if (Math.abs(showedItem - id) > 6) {
//             images.style.transition = '5s all';
//         }

//         if (offset < 0) {
//             offset = 0;
//         }

//         images.style.transform = `translateX(-${offset}px)`;
//         showedItem = id;
//     }

// });