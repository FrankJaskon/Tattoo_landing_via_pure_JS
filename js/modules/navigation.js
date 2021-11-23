import {showContent, closeModal, addSroll, closeModalByEscape} from './modal';

function createModalWindow(dataAttribute, ...classes) {
    const container = document.createElement('div');

    container.classList.add('modal__window');

    if (classes.length) {
        classes.forEach(item => {
            container.classList.add(`${item.replace(/\./, '')}`);
        });
    }

    if (dataAttribute) {
        container.innerHTML = `
            <div data-${dataAttribute} class="modal__window_close add__cursor_pointer add__absolute">
                &times;
            </div>
        `;
    }

    return container;
}

function removeElement(element) {
    element.remove();
}

function closeModalByModal(modal, selector, callback) {
    modal.addEventListener('click', (event) => {
        if (event.target && event.target.classList.contains(`${selector.replace(/\./, '')}`)) {
            addSroll();
            callback();
        }
    })
}

function appendModal(modal, innerWrap, closingSelector) {
    document.body.append(modal);
    showContent(modal);
    closeModal(modal, `data-${closingSelector}`,() => removeElement(modal));
    closeModalByModal(modal, innerWrap, () => removeElement(modal));
    closeModalByEscape(modal);
}

function navigation() {
    const topPanel = document.querySelector('.top__panel '),
          navItemsConteiner = document.querySelector('.header__nav'),
          navItems = document.querySelectorAll('.nav__item'),
          mainHeader = document.querySelector('.main__header '),
          introGallary = document.querySelector('.intro__gallery'),
          topPanelLeftParth = document.querySelector('.top__panel_right'),
          headerBeforeScrolling = document.querySelector('.header__before_scrolling'),
          headerAfterScrolling = document.querySelector('.header__after_scrolling'),
          previosImgsConteiner = document.querySelector('.wrapper__preview_imges'),
          headerElement = document.querySelector('header'),
          mainBtns = document.querySelectorAll('.main__btn'),
          staffBtns = document.querySelectorAll('.staff__btn'),
          staffSection = document.querySelector('.staff__section'),
          navBtns = document.querySelectorAll('.nav__item_link');

    // show one of two header

    function hideItem(header) {
        header.classList.add('visibility__hidden');
        header.style.display = "none";
    }

    function showItem(header) {
        header.classList.remove('visibility__hidden');
        header.style.display = "block";
    }

    hideItem(headerAfterScrolling);

    function throttle (callback, limit) {
        var waiting = false;                      // Initially, we're not waiting
        return function () {                      // We return a throttled function
            if (!waiting) {                       // If we're not waiting
                callback.apply(this, arguments);  // Execute users function
                waiting = true;                   // Prevent future invocations
                setTimeout(function () {          // After a period of time
                    waiting = false;              // And allow future invocations
                }, limit);
            }
        };
    }

    setInterval(throttle(swithHeaders, 500), 500);

    let isHappenedBefore = true,
    isHappenedAfter = false;

    function addVisibleBefore() {
        hideItem(headerAfterScrolling);
        headerAfterScrolling.classList.remove('fade0_5s0s');
        showItem(headerBeforeScrolling);
        headerElement.style.marginTop = "0";
        isHappenedAfter = false;
        isHappenedBefore = true;
    }

    function addVisibleAfter() {
        hideItem(headerBeforeScrolling);
        showItem(headerAfterScrolling);
        headerAfterScrolling.classList.add('fade0_5s0s');
        headerElement.style.marginTop = "50px";
        isHappenedBefore = false;
        isHappenedAfter = true;
    }

    if (document.documentElement.scrollTop > 300) {
        addVisibleAfter();
    } else {
        addVisibleBefore();
    }

    function swithHeaders() {
        if (document.documentElement.scrollTop > 100 && document.documentElement.scrollTop < 10) {
            return;
        }
        window.addEventListener('scroll', function() {
            if (document.documentElement.scrollTop > 50) {
                if (isHappenedBefore && !isHappenedAfter) {
                    addVisibleAfter();
                }
            } else {
                if (!isHappenedBefore && isHappenedAfter) {
                    addVisibleBefore();
                }
            }
        });
    }

    // add scrolling for buttons

    function addScrollingBtns(btns, target) {
        btns.forEach(btn => {
            btn.addEventListener('click', (event) => {
                event.preventDefault();

                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            });
        });
    }

    addScrollingBtns(mainBtns, headerElement);
    addScrollingBtns(staffBtns, staffSection);

    // show gallary

    const gallaryBtns = document.querySelectorAll('.gallary__btn');

    function addPhotoInGallary(url) {
        const modalContainer = createModalWindow('close_gallary_modal', '.gallary__modal'),
              additionalImgesWrapper = document.createElement('div'),
              imgesWrapper = document.createElement('div');

        additionalImgesWrapper.classList.add('additional__gallary_content_wrap');
        additionalImgesWrapper.append(imgesWrapper);

        imgesWrapper.classList.add('gallary__content_main_wrap');

        // try {
        //     const oldModalWindow = document.querySelector('.gallary__modal');

        //     oldModalWindow.remove();
        // } catch(error) {
        //     console.error();
        // }

        // const container = createModalWindow('close_gallary_modal', '.gallary__modal');

        // gallary.append(container);

        // hideContent(gallary);

        axios.get(url, {mode: 'cors'})
        .then(response => {
            response.data.forEach(
                ({img,
                altImg
            }) => {
                imgesWrapper.innerHTML += `
                <div class="gallary__photo_box add__cursor_pointer">
                    <img src="img/icons/zoom-img.png"
                         class="gallary__zoom_img contain add__absolute visibility__hidden">
                    <img src=${img} alt="${altImg}" class="gallary__img cover">
                </div>
                `;
            });
        }).then(() => {
            modalContainer.append(additionalImgesWrapper);
            // modalContainer.append(imgesWrapper);
            // document.body.append(modalContainer);
            // showContent(modalContainer);
            // closeModal(modalContainer, 'data-close_gallary_modal',() => removeElement(modalContainer));
            // closeModalByEscape(modalContainer);
            appendModal(modalContainer, 'additional__gallary_content_wrap', 'close_gallary_modal');

            showingImg();

        });
    }

    function bindGallaryBtns() {
        gallaryBtns.forEach(btn => {
            btn.addEventListener('click', (event) => {
                event.preventDefault();

                // const container = document.querySelector('.gallary__modal');
                // console.log(container);

                if (event.target.classList.contains('gallary__workings_btn')) {
                    addPhotoInGallary('https://my-json-server.typicode.com/FrankJaskon/tattoo_first_landing_via_pure_js_html_css/workings');
                } else if (event.target.classList.contains('gallary__sketches_btn')) {
                    addPhotoInGallary('https://my-json-server.typicode.com/FrankJaskon/tattoo_first_landing_via_pure_js_html_css/sketches');
                } else if (event.target.classList.contains('gallary__meetings_btn')) {
                    addPhotoInGallary('https://my-json-server.typicode.com/FrankJaskon/tattoo_first_landing_via_pure_js_html_css/events');
                } else {
                    return;
                }
            });
        });
    }

    bindGallaryBtns();


    // zooming img gallary

    function showingImg() {
        const boxesImg = document.querySelectorAll('.gallary__photo_box'),
              images = document.querySelectorAll('.gallary__img');

        boxesImg.forEach((box, num) => {
            box.addEventListener('click', () => {
                // const container = document.createElement('div');
                const modalContainer = createModalWindow();

                modalContainer.innerHTML = `
                    <div class="gallary__viewing_photo_box add__cursor_pointer fade0_5s0s">
                        <img src=${images[num].getAttribute('src')} alt="${images[num].getAttribute('altImg')}"
                             class="gallary__viewing_img contain">
                    </div>
                `;
                box.parentElement.append(modalContainer);

                modalContainer.addEventListener('click', () => {
                    modalContainer.remove();
                });
            });
        });
    }

    // show about

    const showingAboutBtns = document.querySelectorAll('.about__btn');

    showingAboutBtns.forEach(btn => {
        btn.addEventListener('click', event => {
            event.preventDefault();

            const modalContainer = createModalWindow('close_about_modal');

            modalContainer.innerHTML += `
                <div class="about__content_wrapper">
                    <h3 class="about__title content__title">О нас</h3>
                    <div class="about__img_wrapper">
                        <img src="img/contant/about/our-place.jpg" alt="our place" class="about__img cover">
                    </div>
                    <p class="content__text about__content__text">
                        <span class="title">heart for art</span>
                        в индустрии татуировок достаточно продолжительное время,
                        мастера своего дела собрались вместе, чтобы создать лучший тату салон в Мариуполе.
                        <br>
                        О профессионализме мастеров  тату салона говорят заслуги нашей команды на  европейской арене.
                        Без сомнений, мы справимся с работами любой сложности,
                        поможем с выбором эскиза и цветового решения. Будьте уверены, результат Вас не разочарует!
                        <br>
                        Наш приоритет – это забота о вашем комфорте. Именно поэтому мы выбрали максимально удобное
                        расположение нашего тату салона.
                        <br>
                        Эргономичные раздвижные кушетки, профессиональное оборудование,  с
                        амые высококачественные краски – компромиссам здесь не место.
                        <br>
                        Перекрытие старых татуировок и шрамов, удаление татуировок лазером –
                        мы предоставляем полный спектр услуг в данной сфере.
                        <br>
                        Если стильная и качественная татуировка Ваш выбор,
                        тату салон <span class="title">heart for art</span> ждет Вас.
                    </p>
                </div>
            `;

            appendModal(modalContainer, 'about__content_wrapper', 'close_about_modal');
        });
    });


    // show FAQ

    const showingFAQBtns = document.querySelectorAll('.faq__btn');

    showingFAQBtns.forEach(btn => {
        btn.addEventListener('click', event => {
            event.preventDefault();

            const modalContainer = createModalWindow('close_faq_modal');

            modalContainer.innerHTML += `
                <div class="faq__content_wrapper">
                    <h3 class="faq__title content__title">Хочется татуировку?</h3>
                    <div class="content__text">
                        <p class="preview">
                            Украшать свое тело рисунками
                            или надписями было и будет модно.
                            Главное – выбрать правильное тату, которое не только будет нести смысловую нагрузку,
                            но и выделится красотой исполнения.
                            Для талантливого мастера – это вполне выполнимая задача.
                        </p>
                        <dl>
                            <dt>
                                <h3 class="faq__title content__title">ДЕЛАЕМ ТАТУИРОВКУ: КАК ЭТО ПРОИСХОДИТ?</h3>
                            </dt>
                            <dd>
                                <ul>
                                    <li>
                                        Первый важный шаг на пути к получению действительно крутой татуировки
                                        заключается в выборе рисунка, с опорой на его значение. Например, очень популярна
                                        среди девушек бабочка, которая воплощает символ перерождения, нового начинания и
                                        попросту является символом свободы и неземной красоты.
                                    </li>
                                    <li>
                                        Второй шаг – определиться со стилем татуировки, ведь та же бабочка может быть
                                        выполненной в разных направлениях.
                                    </li>

                                    <li>
                                        Третий шаг – подготовка эскиза и выбор профессионального мастера.
                                        Лучше заниматься эскизом вместе с мастером,
                                        чтобы он имел точное представление о желании клиента.
                                    </li>
                                </ul>
                            </dd>
                        </dl>
                        <dl>
                            <dt>
                                <h3 class="faq__title content__title">КАКИЕ БЫВАЮТ <span>СТИЛИ</span> ТАТУИРОВОК?</h3
                            </dt>
                            <dd>
                                <p>
                                    Сейчас татуировка носит, прежде всего, декоративный характер,
                                    поэтому и стили тату так часто смешиваются между собой.
                                    Тем не менее, принято выделять основные, «чистые» стили рисунков на коже.
                                </p>
                            </dd>
                        </dl>
                        <dl>
                            <dt>
                                <h3 class="faq__title content__title">ЭТНИЧЕСКИЙ СТИЛЬ</h3>
                            </dt>

                            <dd>
                                <p>
                                    Этнический стиль татуировок – самый распространенный,
                                    поскольку он объединяет несколько направлений.
                                    Это всевозможные изображения, собранные с истории разных народов.
                                    Так, к этно-татуировкам относится:
                                </p>
                                <p>
                                    кельтский стиль, который ярко узнаваем своей характерной «плетенкой»
                                    – орнаментом с выразительными узлами;
                                    индейские мотивы, среди которых особо выделяются тату в стиле майя и ацтеков;
                                    тату в стиле олд-скул вернула популярность, сегодня такие рисунки можно наблюдать
                                    на теле представителей всех слоев населения;
                                    восточный стиль идеально подходит для выражения силы, преданности,
                                    чувств или своего мировоззрения. Чаще всего клиенты тату-салона хотят китайские,
                                    японские или индийские восточные символы на коже. Не теряют актуальности иероглифы
                                    – красивые и оригинальные одновременно;
                                    полинезийский – это стиль тату, которому характерны изображения с волнами, лентами,
                                    спиральными узорами и линиями, расходящимися лучами;
                                    скифский богат разными приемами оформления, звериными мотивами;
                                    стиль трайбл тоже относится к этно-тату.
                                </p>
                                <h3 class="faq__title content__title">Другие стили татуировок, популярные сейчас:</h3>
                                <ul class="faq__styles_list">
                                    <li>стиль фэнтези</li>
                                    <li>анималистический</li>
                                    <li>растительный</li>
                                    <li>славянский</li>
                                    <li>кибернетический</li>
                                    <li>Black & Grey</li>
                                    <li>дотворк</li>
                                    <li>Blackwork-tattoo</li>
                                </ul>
                            </dd>
                        </dl>
                        <dl>
                            <dt>
                            <h3 class="faq__title content__title">КАК ВЫБРАТЬ «СВОЮ» ТАТУИРОВКУ?</h3>
                            </dt>
                            <dd>
                                <p>
                                    Стилей действительно очень много, и в каждом из них кроются тысячи рисунков,
                                    узоров и орнаментов – можно запутаться в своих желаниях.
                                    Вот несколько советов, которые помогут с выбором:
                                </p>
                                <p>
                                    Не нужно копировать чью-то татуировку, пусть даже красивую – будьте уникальны!
                                    Изучайте портфолио мастеров – возможно, какая-то из работ
                                    покажется вам близкой по духу. Не думайте о том, какие тату в моде, ориентируйтесь
                                    на свои ощущения, ведь с рисунком на коже придется сродниться на всю жизнь.
                                    Помните, что тату – это больше, чем просто тушь под кожей.
                                    Мы делаем их с желанием отобразить сокровенную частицу внутреннего мира.
                                    Обязательно выбирайте мастера-профессионала,
                                    который воплотит в жизнь любые ваши фантазии.
                                </p>
                            </dd>
                        </dl>
                    </div>
                </div>
            `;

            appendModal(modalContainer, 'faq__content_wrapper', 'close_faq_modal');
        });
    });



}

export default navigation;
export {createModalWindow, removeElement, appendModal};