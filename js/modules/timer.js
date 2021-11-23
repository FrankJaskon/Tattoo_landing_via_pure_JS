function timer() {
    //Timer

    const deadline = new Date('2022-04-01');

    function getDifferenceOfTime(endTime) {
        const differenceOfTime = Date.parse(endTime) - Date.parse(new Date()),
            month = Math.floor(differenceOfTime / (1000 * 60 * 60 * 24 * 31)),
            days = Math.floor((differenceOfTime / (1000 * 60 * 60 * 24)) % 31),
            hours = Math.floor((differenceOfTime / (1000 * 60 * 60)) % 24),
            minutes = Math.floor((differenceOfTime / (1000 * 60)) % 60),
            seconds = Math.floor((differenceOfTime / 1000) % 60);

        return {differenceOfTime, month, days,
            hours, minutes, seconds};
    }

    function getZero(num) {
        if (num >= 0 && num < 10) {
            return `0${num}`;
        } else {
            return num;
        }
    }

    function changeDate(selector, endTime) {
        const timer = document.querySelector(selector),
            month = timer.querySelector('#month'),
            days = timer.querySelector('#days'),
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds'),
            actionTime = setInterval(setDate, 1000),
            action = document.querySelector('.action__section');

        setDate();

        function setDate() {
            const value = getDifferenceOfTime(endTime);

            month.innerHTML = getZero(value.month);
            days.innerHTML = getZero(value.days);
            hours.innerHTML = getZero(value.hours);
            minutes.innerHTML = getZero(value.minutes);
            seconds.innerHTML = getZero(value.seconds);

            if (value.differenceOfTime <= 0) {
                clearInterval(actionTime);
            }
        }
    }

    changeDate('.action__timer_wrap', deadline);

    // setup margin bottom for staff section depending on height of footer

    const footer = document.querySelector('.footer'),
          footerHeight = window.getComputedStyle(footer).height,
          timer = document.querySelector('.action__section');

    timer.style.marginBottom = footerHeight;
}

export default timer;