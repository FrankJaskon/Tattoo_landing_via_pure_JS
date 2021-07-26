'use strict';

window.addEventListener('DOMContentLoaded', () => { 
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
      });
  }
  function scrollIntoViewTabNumb(i) {
    content[i].scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  }
  addRefrenceSubtitles ();
});


