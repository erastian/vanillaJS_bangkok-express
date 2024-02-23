import createElement from './../../assets/lib/create-element.js';

export default class ProductCard {
    constructor(product) {
        this.element = product;
        this.result = null;
    }

    render() {
        this.result = createElement(`
      <div class="card">
          <div class="card__top">
              <img src="./assets/images/products/${this.element.image}" class="card__image" alt="product">
              <span class="card__price">€${this.element.price.toFixed(2)}</span>
          </div>
          <div class="card__body">
              <div class="card__title">${this.element.name}</div>
              <button type="button" class="card__button" data-id="${this.element.id}">
                  <img src="./assets/images/icons/plus-icon.svg" alt="icon">
              </button>
          </div>
      </div>
    `);

        this.result.querySelector('.card__button').addEventListener('click', function () {
            this.dispatchEvent(new CustomEvent("product-add", {
                detail: this.dataset.id,
                bubbles: true
            }));
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
