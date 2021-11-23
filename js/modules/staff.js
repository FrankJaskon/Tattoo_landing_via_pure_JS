import {showContent, hideContent, closeModal, closeModalByEscape, viewModal} from './modal';
import {createModalWindow, removeElement, appendModal} from './navigation';

function staff() {
    const mainSection = document.querySelector('.staff__section'),
          conteiner = document.querySelector('.staff__main_wrapper'),
          personCardsWrap = document.querySelectorAll('.staff__person_wrapper'),
          imgesWrap = document.querySelectorAll('.staff__img_wrap'),
          imges = document.querySelectorAll('.staff__img'),
          contentsWrap = document.querySelectorAll('.staff__person_descrition_wrap'),
          descriptionsContent = document.querySelectorAll('.staff__person_descrition'),
          staffModal = document.querySelector('.staff__person_modal');

    function hideStaffCards(wrapper) {
        wrapper.forEach(item => {
            item.style.position = 'absolute';
            item.style.visibility = 'hidden';
            item.style.display = 'none';
        });
    }

    function showStaffCards() {
        personCardsWrap.forEach((item, num) => {
            item.style.position = 'static';
            item.style.visibility = 'visible';
            item.style.display = 'block';

            if (num % 2 !== 0) {
                item.style.animation = `slideLeftAppearence 1.${num}s`;
            } else {
                item.style.animation = `slideRightAppearence 1.${num}s`;
            }
        });
    }

    // hideContent(staffModal);
    hideStaffCards(personCardsWrap);

    function showIntroContent() {
        const introCard = document.querySelector('.intro__person_wrapper'),
              introDescription = document.querySelector('.intro__description_wrapper'),
              staffHeader = document.querySelector('.staff__section_header');

        let isOpenedStaffCards = false,
            isFirstShowing = true;


        const options = {
            threshold: 0.5,
            rootMargin: '60% 0px 60% 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.intersectionRatio <= 0) {
                    return;
                }
                if (entry.isIntersecting && isFirstShowing) {
                    isFirstShowing = false;

                    introCard.style.visibility = 'visible';
                    introDescription.style.visibility = 'visible';
                    staffHeader.style.visibility = 'visible';

                    entry.target.append(introCard, introDescription);
                } else if (isOpenedStaffCards) {
                    hideStaffCards(personCardsWrap);
                    introCard.style.display = 'block';
                    introDescription.style.display = 'block';
                }
            });
        }, options);

        observer.observe(conteiner);

        conteiner.addEventListener('click', (event) => {
            const target = event.target;


            if (target && (target.classList.contains('intro__button') || target.classList.contains('intro__img'))) {
                introCard.style.display = 'none';
                introDescription.style.display = 'none';

                showStaffCards();

                isOpenedStaffCards = true;
            } else if (target && target.classList.contains('staff__img')) {
                addPersonInfo(target.id);
                // showContent(staffModal);
            } else {
                return;
            }
        });

        // staffModal.addEventListener('click', event => {
        //     const target = event.target;

        //     if (target && target.classList.contains("staff__person_modal_close")) {
        //         hideContent(staffModal);
        //     }
        // });

        function addPersonInfo(personName) {
            axios.get('https://github.com/FrankJaskon/Js_tabs_sliders_calculator_modals_to_food_landing/blob/[main|master]/db.json/staff')
            // axios.get('http://localhost:3000/staff')
            .then(resolve => {
                resolve.data.forEach(person => {
                    if (person.nameEng.toLowerCase() == personName.toLowerCase()) {
                        const modalContainer = createModalWindow('close_staff_modal', 'staff__person_modal');

                        modalContainer.innerHTML += `
                            <div class="staff__person_modal_wrapper">
                                <div data-close_staff_modal class="staff__person_modal_close add__cursor_pointer add__absolute">
                                    &times;
                                </div>
                                <div class="staff__person_modal_content_wrap">
                                    <h3 class="content__title">
                                        <span class="title">${person.nameRus}</span>
                                    </h3>
                                    <p class="content__text">
                                        ${person.description}
                                    </p>
                                    <div class="content__button staff__person_button">
                                        <button data-${person.nameEng}_writing type="none"
                                                class="add__cursor_pointer text_button">
                                            Записаться к мастеру
                                        </button>
                                    </div>
                                </div>
                                <div class="staff__person_modal_img_wrap">
                                    <img src=${person.img} alt="${person.altImg}" class="staff__modal_img cover">
                                </div>
                            </div>
                        `;
                        document.body.append(modalContainer);

                        appendModal(modalContainer, '.staff__person_modal_wrapper', 'close_staff_modal');
                        viewModal(document.querySelectorAll('.text_button'));

                        // showContent(modalContainer);
                        // closeModal(modalContainer, 'data-close_staff_modal', () => removeElement(modalContainer));
                        // closeModalByEscape(modalContainer);
                    }
                                    //     <div class="staff__person_modal_box add__absolute">
                //     <div class="staff__person_modal_wrapper">
                //         <div data-close_staff_modal class="staff__person_modal_close add__cursor_pointer add__absolute">
                //             &times;
                //         </div>
                //         <div class="staff__person_modal_content_wrap">
                //             <h3 class="content__title">
                //                 <span class="title">${person.nameRus}</span>
                //             </h3>
                //             <p class="content__text">
                //                 ${person.description}
                //             </p>
                //             <div class="content__button staff__person_button">
                //                 <button data-${person.nameEng}_writing type="none" class="add__cursor_pointer">
                //                     Записаться к мастеру
                //                 </button>
                //             </div>
                //         </div>
                //         <div class="staff__person_modal_img_wrap">
                //             <img src=${person.img} alt="${person.altImg}" class="staff__modal_img cover">
                //         </div>
                //     </div>
                // </div>
                });
            });
        }
    }

    showIntroContent();

}

export default staff;

// const callback = function(entries, observer) {
//     if (entries[0].intersectionRatio <= 0) {
//         return;
//     }
//     entries.forEach(entry => {
//         if (entry.isIntersecting) {
//           isLeaving = true;
//           entries[0].target.append(introCard, introDescription);
//         } else if (isLeaving) {
//           // we are EXITING the "capturing frame"
//           isLeaving = false;
//           // Do something with exiting entry
//         }
//       });

//     entries[0].target.append(introCard, introDescription);

//     observer.disconnect();
// };

















// function showIntroContent() {
//     const introCard = document.createElement('div'),
//           introDescription = document.createElement('div');

//     introCard.classList.add('intro__person_wrapper', 'add__relative', 'add__cursor_pointer');
//     introDescription.classList.add('intro__description_wrapper');

//     introCard.innerHTML = `
//     <div class="intro__person_wrapper add__relative add__cursor_pointer">
//         <div class="intro__img_wrap">
//             <img src="/img/contant/staff/person-1.jpg" alt="" class="intro__img cover">
//         </div>
//     </div>
//     `;

//     introDescription.innerHTML = `
//     <div class="intro__description_wrapper">
//         <h3 class="intro__staff_title content__title">
//             <span class="title">Heart For Art</span> Мариуполь
//         </h3>
//         <p class="content__text">
//             У нас вы сможете расслабиться и получать удовольствие от работы наших профессионалов, разработки эскизов и общения с нашими тату-артистами.
//             Наша студия - это место, в котором сотрудники заботятся об имидже и стиле своих клиентов, чтобы они выглядели впечатляюще в любой ситуации.
//         </p>
//         <p class="content__text">
//             <span class="title">Heart For Art</span> – это место, где вы можете отдохнуть и хорошо провести время в приятной компании.
//         </p>
//         <div class="intro__button_wrap content__button">
//             <button class="intro__button add__cursor_pointer">
//                 Наши мастера
//             </button>
//         </div>
//     </div>
//     `;

//     const options = {
//         root: document.querySelector(null)
//     };

//     const callback = function(entries, observer) {
//         if (entries[0].intersectionRatio <= 0) {
//             return;
//         }

//         entries[0].target.append(introCard, introDescription);

//         observer.disconnect();
//     };

//     const observer = new IntersectionObserver(callback, options);

//     observer.observe(conteiner);

//     conteiner.addEventListener('click', (event) => {
//         const target = event.target;

//         if (target && (target.classList.contains('intro__button') || target.classList.contains('intro__img'))) {
//             introCard.remove();
//             introDescription.remove();

//             showStaffCards();
//         } else if (target && target.classList.contains('staff__img')) {
//             showContent(staffModal);
//         } else {
//             return;
//         }
//     });
// }