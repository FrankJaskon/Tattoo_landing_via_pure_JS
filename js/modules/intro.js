function moveLeft(itemPosition, itemsList, targetItem, width, previousPosition, addstatusFunction) {

    if (itemPosition != 0) {
        if (addstatusFunction) {
            addstatusFunction(itemPosition - 1, itemPosition);
        }
        itemPosition--;
    } else {
        if (addstatusFunction) {
            addstatusFunction(itemsList.length - 1, itemPosition);
        }
        itemPosition = (itemsList.length - 1);
    }
    moveTo(targetItem, itemPosition, width, previousPosition);
    return itemPosition;
}

function moveRight(itemPosition, itemsList, targetItem, width, previousPosition, addstatusFunction) {

    if (itemPosition != itemsList.length - 1) {
        if (addstatusFunction) {
            addstatusFunction(itemPosition + 1, itemPosition);
        }
        itemPosition++;
    } else {
        if (addstatusFunction) {
            addstatusFunction(0, itemPosition);
        }
        itemPosition = 0;
    }
    moveTo(targetItem, itemPosition, width, previousPosition);
    return itemPosition;
}

function moveTo(targetItem, position, width, previousPosition) {
    const offset = position * width;

    targetItem.style.transform = `translateX(-${offset}px)`;

    if (typeof(previousPosition) !== 'undefined') {
        if (previousPosition == position) {
            return;
        }
        const absSlides = Math.abs(previousPosition - position) - 1;

        targetItem.style.transition = `${1.5 + absSlides * 0.2}s all`;
    }
}

function intro({
    container,
    content,
    preview,
    activeClass,
    sliderLeft,
    sliderRight,
    url
}) {

    const gallarySection = document.querySelector(container),
          images = document.querySelector(content),
          width = window.getComputedStyle(images).width.replace(/px|em|rm/, ''),
          previewOfImages = document.querySelector(preview);

    // Getting and showing cards

    axios.get(url, {mode: 'cors'})
    .then((response) => {

        images.style.width = response.data.length * 100 + '%';
        images.classList.add('add__flex');

        gallarySection.style.overflow = 'hidden';

        let imgId = 0;

        response.data.forEach(({
            img,
            altimg
        }) => {
            images.innerHTML += `
                <div class="gallary__wrap_img">
                    <img src="${img}" alt="${altimg}">
                </div>
            `;
            previewOfImages.innerHTML += `
                <div class="gallary__wrap_preview_img">
                    <img src="${img.replace(/\./, '-mini.')}" alt="${altimg}-mini" id="${'prevImg' + imgId++}">
                </div>
            `;
        });

        // Adding slider for intro

        // let previousPosition = Math.floor(Math.random() * 10);
        let previousPosition = 0;

        showGallaryImg(previousPosition);

        function showGallaryImg(next) {
            const icons = document.querySelectorAll('.gallary__wrap_preview_img > img');

            let intervalOfAutoGallary = setTimeout(function showNextImg() {
                next = moveRight(next, icons, images, width, previousPosition, addActiveStatus);
                previousPosition = next;
                intervalOfAutoGallary = setTimeout(showNextImg, 7000);
            }, 7000);

            window.addEventListener('visibilitychange', () => {
                if (document.visibilityState === 'hidden') {
                    clearTimeout(intervalOfAutoGallary);
                }
            });

            function addActiveStatus(next, previous) {
                icons[previous].parentElement.classList.remove(activeClass.replace(/\./, ''));
                icons[next].parentElement.classList.add(activeClass.replace(/\./, ''));
            }

            moveToImg(next);

            function moveToImg(next) {
                moveTo(images, next, width, previousPosition);
                addActiveStatus(next, previousPosition);
                previousPosition = next;
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

            const arrowLeft = document.querySelector(sliderLeft),
                arrowRight = document.querySelector(sliderRight);

            arrowLeft.addEventListener('click', () => {
                clearTimeout(intervalOfAutoGallary);
                next = moveLeft(next, icons, images, width, previousPosition, addActiveStatus);
                previousPosition = next;
            });
            arrowRight.addEventListener('click', () => {
                clearTimeout(intervalOfAutoGallary);
                next = moveRight(next, icons, images, width, previousPosition, addActiveStatus);
                previousPosition = next;
            });
        }
    });
}

export default intro;
export {moveLeft, moveRight, moveTo};