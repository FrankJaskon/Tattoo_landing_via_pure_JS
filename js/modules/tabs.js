function tabs({
  container,
  contentConteiner,
  descriptionConteiner,
  tabsListContainer,
  tabsName
}) {
    const wrapperContent = document.querySelector(container),
      content = Array.from(wrapperContent.querySelectorAll(contentConteiner)),
      contentDescription = document.querySelectorAll(descriptionConteiner),
      tabsParent = document.querySelector(tabsListContainer),
      tabs = document.querySelectorAll(tabsName);

    let shiftTab,
        newContent;

    function shiftTabs(i = 0) {

      shiftTab = 0;

      newContent = content.concat(content.slice(0, i));
      newContent.splice(0, i);

      newContent.forEach((item, num) => {
        item.classList.add('add__absolut');
        tabs[num].classList.remove('active');

        if (contentDescription[num]) {
          contentDescription[num].classList.remove('fade');
          contentDescription[num].style.opacity = 0;
        }

        item.style.cssText = `
          transition: 1s all;
          top: ${shiftTab / 4}px;
          left: -${shiftTab}px;

          z-index: -${shiftTab};
          opacity: ${1 - shiftTab / 50};
        `;

        shiftTab += 40;
      });

      newContent[0].style.opacity = 1;

      tabs[i].classList.remove('active');
    }

    shiftTabs();
    showTab();

    function showTab(i = 0) {
      tabs[i].classList.add('active');
      contentDescription[i].classList.add('fade');
    }


      tabsParent.addEventListener('click', (e) => {
        const target = e.target;

        if (target && target.classList.contains(tabsName.replace(/\./, ''))) {
            tabs.forEach((item, i) => {
                if (item == target) {
                  shiftTabs(i);
                  showTab(i);
                }
            });
        }
    });

    // Bind subtittles with tabs

    addRefrenceSubtitles ();
        
    function addRefrenceSubtitles () {
      let cardSubtitles;

      setTimeout(() => {
        cardSubtitles = document.querySelectorAll('.card__item_title');

        cardSubtitles.forEach((item) => {
          item.addEventListener('click', (event) => {
          tabs.forEach((sometab, num) => {
              if (event.target.innerHTML === sometab.innerHTML) {

              shiftTabs(num);
              showTab(num);
              scrollIntoViewTabNumb(num);
              }
          });
      });
      function scrollIntoViewTabNumb() {
          wrapperContent.scrollIntoView({
              behavior: 'smooth',
              block: 'end'
          });
      }
  });
      }, 1000);

  }
}

export default tabs;