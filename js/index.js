import Carousel from '../js/modules/carousel.js';
import slides from '../js/modules/slides.js';

import RibbonMenu from '../js/modules/ribbon-menu.js';
import categories from '../js/modules/categories.js';

import StepSlider from '../js/modules/step-slider.js';
import ProductsGrid from '../js/modules/product-grid.js';

import CartIcon from '../js/modules/cart-icon.js';
import Cart from '../js/modules/cart.js';

export default class Main {

  constructor() {
  }

  async render() {
    this.headerCarousel();
    this.ribbonMenu();
    this.stepSlider();
    this.cartIcon();
    this.cart = new Cart(this.cartIcon);
    this.products = await this.getProducts();
    this.renderProducts();

    this.productsGrid.updateFilter({
      noNuts: document.getElementById('nuts-checkbox').checked,
      vegeterian: document.getElementById('vegeterian-checkbox').checked,
      maxSpiciness: this.stepSlider.value,
      category: this.ribbonMenu.value
    });

    document.body.addEventListener('product-add', e => {
      this.cart.addProduct(this.products.find(product => product.id === e.detail));
    });
    document.body.addEventListener('slider-change', e => {
      this.productsGrid.updateFilter({maxSpiciness: e.detail});
    });
    document.body.addEventListener('ribbon-select', e => {
      this.productsGrid.updateFilter({category: e.detail});
    });
    document.querySelector('#nuts-checkbox').onchange = e => {
      this.productsGrid.updateFilter({noNuts: e.target.checked});
    };
    document.querySelector('#vegeterian-checkbox').onchange = e => {
      this.productsGrid.updateFilter({vegeterianOnly: e.target.checked});
    };
  }

  headerCarousel() {
    this.carousel = new Carousel(slides);
    document.querySelector('[data-carousel-holder]').append(this.carousel.elem);
  }

  ribbonMenu() {
    this.ribbonMenu = new RibbonMenu(categories);
    document.querySelector('[data-ribbon-holder]').append(this.ribbonMenu.elem);
    document.querySelector('[data-ribbon-holder] .ribbon__inner').style.height = 'auto'; //Fix menu height
  }

  stepSlider() {
    this.stepSlider = new StepSlider({steps: 5, value: 3});
    document.querySelector('[data-slider-holder]').append(this.stepSlider.elem);
  }

  cartIcon() {
    this.cartIcon = new CartIcon();
    document.querySelector('[data-cart-icon-holder]').append(this.cartIcon.elem);
  }

  async getProducts() {
    let response = await fetch('./products.json');
    return response.json();
  }

  renderProducts() {
    this.productsGrid = new ProductsGrid(this.products);
    document.querySelector('[data-products-grid-holder]').innerHTML = '';
    document.querySelector('[data-products-grid-holder]').append(this.productsGrid.elem);
  }
}
