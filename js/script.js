"use strict";
import intro from './modules/intro';
import tabs from './modules/tabs';
import cards from './modules/cards';
import modal from './modules/modal';
import timer from './modules/timer';
import staff from './modules/staff';
import navigation from './modules/navigation';

document.addEventListener('DOMContentLoaded', () => {
    try {
        intro({
            container: '.intro__gallary',
            content: '.wrapper__view_img',
            preview: '.wrapper__preview_imges',
            activeClass: '.active__prev_img',
            sliderLeft: '.intro__gallary_slider_left',
            sliderRight: '.intro__gallary_slider_right',
            url: 'http://localhost:3000/introGallary'
        });
    } catch(error) {
        console.log(error);
    }
    try {
        tabs({
            container: '.tabs__main_wrapper',
            contentConteiner: '.tabs__content',
            descriptionConteiner: '.transparent__box',
            tabsListContainer: '.tabs__ul_wrapper',
            tabsName: '.tabs_item'
        });
    } catch(error) {
        console.log(error);
    }
    try {
        cards({
            conteiner: '.cards__wrapper',
            boxForCards: '.cards__additional_wrapper',
            conteinerForThreeCards: '.inner__box',
            sliderLeft: '.slider__left',
            sliderRight: '.slider__right',
            url: 'http://localhost:3000/menu',
            slidersSelector: 'cards__sliders'
        });
    } catch(error) {
        console.log(error);
    }
    try {
        modal();
    } catch(error) {
        console.log(error);
    }
    try {
        timer();
    } catch(error) {
        console.log(error);
    }
    try {
        staff();
    } catch(error) {
        console.log(error);
    }
    try {
        navigation();
    } catch(error) {
        console.log(error);
    }
});
