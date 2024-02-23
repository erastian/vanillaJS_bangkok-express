import createElement from './../../assets/lib/create-element.js';

export default class RibbonMenu {
    constructor(categories) {
        this.categories = categories;
        this.result = null;
    }

    render() {
        const ribbon = createElement(`<div class="ribbon"></div>`);
        const toLeft = createElement(`<button class="ribbon__arrow ribbon__arrow_left">
      <img src="./../../assets/images/icons/angle-icon.svg" alt="icon">
    </button>`);
        const toRight = createElement(`<button class="ribbon__arrow ribbon__arrow_right ribbon__arrow_visible">
      <img src="./../../assets/images/icons/angle-icon.svg" alt="icon">
    </button>`);
        const ribbonHolder = createElement(`<nav class="ribbon__inner"></nav>`);


        toLeft.addEventListener('click', function () {
            scrollTo('left');
        });
        toRight.addEventListener('click', function () {
            scrollTo('right');
        });
        ribbonHolder.addEventListener('scroll', function () {
            const border = 100;

            if (ribbonHolder.scrollLeft < border) {
                toLeft.classList.remove('ribbon__arrow_visible');
            } else if (ribbonHolder.scrollWidth - ribbonHolder.scrollLeft - ribbonHolder.clientWidth < border) {
                toRight.classList.remove('ribbon__arrow_visible');
            } else {
                toLeft.classList.add('ribbon__arrow_visible');
                toRight.classList.add('ribbon__arrow_visible');
            }
        });
        ribbonHolder.addEventListener('click', function (e) {
            e.preventDefault();
            if (e.target.closest('A')) {
                ribbonHolder.querySelectorAll('.ribbon__item').forEach(el => el.classList.remove('ribbon__item_active'));
                e.target.closest('A').classList.add('ribbon__item_active');
                this.dispatchEvent(new CustomEvent("ribbon-select", {
                    detail: e.target.closest('A').dataset.id,
                    bubbles: true
                }));
            }
        });

        function scrollTo(direction) {
            switch (direction) {
                case 'left':
                    ribbonHolder.scrollBy(-350, 0);
                    break;

                case 'right':
                    ribbonHolder.scrollBy(350, 0);
                    break;
            }

        }


        for (let category of this.categories) {
            let elem = createElement(`<a href="#" class="ribbon__item" data-id="${category.id}">${category.name}</a>`);
            ribbonHolder.appendChild(elem);
        }


        ribbon.appendChild(toLeft);
        ribbon.appendChild(ribbonHolder);
        ribbon.appendChild(toRight);

        this.result = ribbon;
    }


    get elem() {
        if (this.result) {
            return this.result;
        } else {
            this.render();
            return this.result;
        }
    }
}
