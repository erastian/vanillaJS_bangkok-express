import createElement from '../../assets/lib/create-element.js';
import escapeHtml from '../../assets/lib/escape-html.js';

import Modal from './modal.js';

export default class Cart {
    cartItems = []; // [product: {...}, count: N]

    constructor(cartIcon) {
        this.cartIcon = cartIcon;

        this.addEventListeners();
    }

    addProduct(product) {
        if (product) {
            let cartItem = this.cartItems.find(el => el.product.id === product.id);

            if (!cartItem) {
                cartItem = {product, count: 1};
                this.cartItems.push(cartItem);
            } else {
                cartItem.count++;
            }

            this.onProductUpdate(cartItem);
        }
    }

    updateProductCount(productId, amount) {
        let cartItem = this.cartItems.find(el => el.product.id === productId);
        if (amount === 1) {
            cartItem.count++;
        } else if (amount === -1) {
            cartItem.count--;
        }
        if (cartItem.count === 0) {
            this.cartItems.splice(this.cartItems.indexOf(cartItem), 1);
        }
        this.onProductUpdate(cartItem);
    }

    isEmpty() {
        return this.cartItems.length === 0;
    }

    getTotalCount() {
        return this.cartItems.reduce((total, item) => total + item.count, 0);
    }

    getTotalPrice() {
        return this.cartItems.reduce((total, item) => total + item.product.price * item.count, 0);
    }

    renderProduct(product, count) {
        return createElement(`
    <div class="cart-product" data-product-id="${product.id}">
      <div class="cart-product__img">
        <img src="../../assets/images/products/${product.image}" alt="product">
      </div>
      <div class="cart-product__info">
        <div class="cart-product__title">${escapeHtml(product.name)}</div>
        <div class="cart-product__price-wrap">
          <div class="cart-counter">
            <button type="button" class="cart-counter__button cart-counter__button_minus">
              <img src="../../assets/images/icons/square-minus-icon.svg" alt="minus">
            </button>
            <span class="cart-counter__count">${count}</span>
            <button type="button" class="cart-counter__button cart-counter__button_plus">
              <img src="../../assets/images/icons/square-plus-icon.svg" alt="plus">
            </button>
          </div>
          <div class="cart-product__price">€${product.price.toFixed(2)}</div>
        </div>
      </div>
    </div>`);
    }

    renderOrderForm() {
        return createElement(`<form class="cart-form">
      <h5 class="cart-form__title">Delivery</h5>
      <div class="cart-form__group cart-form__group_row">
        <input name="name" type="text" class="cart-form__input" placeholder="Name" required value="Santa Claus">
        <input name="email" type="email" class="cart-form__input" placeholder="Email" required value="john@gmail.com">
        <input name="tel" type="tel" class="cart-form__input" placeholder="Phone" required value="+1234567">
      </div>
      <div class="cart-form__group">
        <input name="address" type="text" class="cart-form__input" placeholder="Address" required value="North, Lapland, Snow Home">
      </div>
      <div class="cart-buttons">
        <div class="cart-buttons__buttons btn-group">
          <div class="cart-buttons__info">
            <span class="cart-buttons__info-text">total</span>
            <span class="cart-buttons__info-price">€${this.getTotalPrice().toFixed(2)}</span>
          </div>
          <button type="submit" class="cart-buttons__button btn-group__button button">order</button>
        </div>
      </div>
    </form>`);
    }

    renderModal() {
        this.modal = new Modal();
        this.modal.setTitle('Your order');

        this.productsHolder = createElement('<div></div>');
        for (let product of this.cartItems) {
            this.productsHolder.appendChild(this.renderProduct(product.product, product.count));
        }

        this.productsHolder.appendChild(this.renderOrderForm());

        this.productsHolder.addEventListener('click', this.inModalClick);
        this.productsHolder.querySelector('form').onsubmit = e => this.onSubmit(e);

        this.modal.setBody(this.productsHolder);
        this.modal.open();
    }
    inModalClick = e => {
        if (e.target.closest('.cart-counter__button')) {
            e.preventDefault();
            let btn = e.target.closest('.cart-counter__button');
            if (btn.classList.contains('cart-counter__button_plus')) {
                this.updateProductCount(btn.closest('.cart-product').dataset.productId, 1);
            } else if (btn.classList.contains('cart-counter__button_minus')) {
                this.updateProductCount(btn.closest('.cart-product').dataset.productId, -1);
            }
        }
    }
    onProductUpdate(cartItem) {
        this.cartIcon.update(this);

        if (this.cartItems.length === 0) {
            this.modal.close();
            return;
        }

        if (this.productsHolder && document.body.classList.contains('is-modal-open')) {
            if (cartItem.count === 0) {
                this.productsHolder.querySelector(`[data-product-id="${cartItem.product.id}"]`).remove();
            } else {
                this.productsHolder.querySelector(`[data-product-id="${cartItem.product.id}"] .cart-counter__count`).innerHTML = cartItem.count;
                this.productsHolder.querySelector(`[data-product-id="${cartItem.product.id}"] .cart-product__price`).innerHTML = `€${(cartItem.count * cartItem.product.price).toFixed(2)}`;
                this.productsHolder.querySelector(`.cart-buttons__info-price`).innerHTML = `€${this.getTotalPrice().toFixed(2)}`;
            }
        }
    }

    async onSubmit(event) {
        console.log('here');
        event.preventDefault();
        let successMsg = createElement(`
        <div class="modal__body-inner">
          <p>
            Order successful! Your order is being cooked :) <br>
            We’ll notify you about delivery time shortly.<br>
            <img src="../../assets/images/delivery.gif" alt="">
          </p>
        </div>
        `);
        this.productsHolder.querySelector(`button[type="submit"]`).classList.add('is-loading');
        let cartForm = this.productsHolder.querySelector('.cart-form');
        let orderData = new FormData(cartForm);

        let response = await fetch('https://httpbin.org/post', { method: 'POST', body: orderData });

        if (response.ok) {
            this.modal.setTitle('Success!');
            this.productsHolder.querySelector(`button[type="submit"]`).classList.remove('is-loading');
            this.cartItems = [];
            this.cartIcon.update(this);
            this.productsHolder.innerHTML = '';
            this.productsHolder.append(successMsg);
        } else {
            console.log('Fetch foiled. Response => ', response);
        }
    }

    addEventListeners() {
        this.cartIcon.elem.onclick = () => this.renderModal();
    }
}

