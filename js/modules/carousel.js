import createElement from './../../assets/lib/create-element.js';

export default class Carousel {
  constructor(slides) {
    this.slides = slides;
    this.result = null;
  }

  render() {
    let currentSlide = 0;
    let totalSlides = this.slides.length;
    const carousel = createElement(`<div class="carousel"></div>`);
    const arrRight = createElement(`
        <div class="carousel__arrow carousel__arrow_right">
            <img src="./../../assets/images/icons/angle-icon.svg" alt="icon">
        </div>
    `);
    const arrLeft = createElement(`
        <div class="carousel__arrow carousel__arrow_left">
            <img src="./../../assets/images/icons/angle-left-icon.svg" alt="icon">
        </div>
    `);
    const slidesHolder = createElement(`<div class="carousel__inner"></div>`);

    if (currentSlide === 0) {
      arrLeft.style.display = 'none';
    }

    function moveSlider() {
      let shift = document.querySelector('.carousel').offsetWidth;
      slidesHolder.style.transform = `translateX(-${currentSlide * shift}px)`;
    }

    arrRight.addEventListener('click', function () {
      if (currentSlide < totalSlides - 1) {
        currentSlide++;
        arrLeft.style.display = '';
        moveSlider();
      }
      if (currentSlide === totalSlides - 1) {
        arrRight.style.display = 'none';
      }
    });
    arrLeft.addEventListener('click', function () {
      if (currentSlide > 0) {
        currentSlide--;
        arrRight.style.display = '';
        moveSlider();
      }
      if (currentSlide === 0) {
        arrLeft.style.display = 'none';
      }
    });

    carousel.appendChild(arrRight);
    carousel.appendChild(arrLeft);

    for (let slide of this.slides) {
      slidesHolder.appendChild(createElement(`
          <div class="carousel__slide">
            <img src="./../../assets/images/carousel/${slide.image}" class="carousel__img" alt="slide">
            <div class="carousel__caption">
              <span class="carousel__price">€${slide.price.toFixed(2)}</span>
              <div class="carousel__title">${slide.name}</div>
              <button type="button" class="carousel__button" data-id="${slide.id}">
                <img src="./../../assets/images/icons/plus-icon.svg" alt="icon">
              </button>
            </div>
          </div>
        `)
      );
    }

    carousel.appendChild(slidesHolder);
    this.result = carousel;

    this.result.addEventListener('click', function (e) {
      if (e.target.closest('BUTTON')) {
        this.dispatchEvent(new CustomEvent("product-add", {
          detail: e.target.closest('BUTTON').dataset.id,
          bubbles: true
        }));
      }
    });

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
