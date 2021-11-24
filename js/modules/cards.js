import {moveLeft, moveRight, moveTo} from "./intro";

function cards({
    container,
    boxForCards,
    containerForThreeCards,
    slidersSelector,
    sliderLeft,
    sliderRight,
    url
}) {

    // Construct priceCard
        const wrapperForCard = document.querySelector(boxForCards);
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

                if (this.checkingImgOrder === 'right' || this.checkingImgOrder === 'left') {
                    newCard.style.cssText = `
                        width: 33.57rem;
                        display: flex;
                        flex-direction: row;
                    `;
                } else if (this.checkingImgOrder === 'top' || this.checkingImgOrder === 'bottom') {
                    newCard.style.cssText = `
                        width: 19.286rem;
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
                    <div class="card__content_wrapper">
                        <h3 class="card__item_title add__cursor_pointer">${this.nameOfCard}</h3>
                        <div class="card__item_descr">
                            ${this.content}
                        </div>
                        <div class="card__item_divider"></div>
                        <div class="card__item_price_wrap">
                            <div class="card__item_price_name">
                                Цена:
                            </div>
                            <div class="card__item_price_total">
                                <span class="brown__span">от ${this.price}</span> грн
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
                    const boxes = wrapperForCard.querySelectorAll(containerForThreeCards);

                    for (let i = 0; i < boxes.length; i++) {
                        if (boxes[i].querySelectorAll('.box__price_card').length != 3) {
                            boxes[i].append(newCard);
                            break;
                        }
                    }
                }
            }
        }

        axios.get(url, {mode: 'cors'})
            .then((response) => {
                const count = Math.ceil(response.data.length / 3);
                for (let i = 0; i < count; i++) {
                    const innerBox = document.createElement('div');
                    innerBox.classList.add(containerForThreeCards.replace(/\./, ''));
                    wrapperForCard.append(innerBox);
                }
                wrapperForCard.style.width =
                    (window.getComputedStyle(wrapperForCard.querySelector(containerForThreeCards))
                    .width.replace(/px||em||rm/, '') - 15) * count;

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
                scrollCards();
            });

        // scroll cards animation

        function scrollCards() {
            const mainWrapper = document.querySelector(container),
                additionalWrapper = document.querySelector(boxForCards),
                left = document.querySelector(sliderLeft),
                right = document.querySelector(sliderRight),
                itemsBoxes = document.querySelectorAll(containerForThreeCards),
                itemWidth = window.getComputedStyle((itemsBoxes[0])).width.replace(/px|em|rm/, '');

            if (itemsBoxes.length > 1 && itemsBoxes) {
                left.style.transition = '1s all';
                right.style.transition = '1s all';

                let positionNum = 0;

                moveTo(additionalWrapper, positionNum, itemWidth);

                mainWrapper.addEventListener('mousedown', (event) => {
                    if (event.target && event.target.parentElement.classList
                        .contains(slidersSelector.replace(/\./, ''))) {

                        if (event.target.parentElement.classList.contains(sliderLeft.replace(/\./, ''))) {
                            positionNum = moveLeft(positionNum, itemsBoxes, additionalWrapper, itemWidth);
                        } else {
                            positionNum = moveRight(positionNum, itemsBoxes, additionalWrapper, itemWidth);
                        }
                    }
                });
            } else {
                left.style.visibility = 'hidden';
                right.style.visibility = 'hidden';
            }

        }
}

export default cards;