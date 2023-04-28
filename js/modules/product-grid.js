import createElement from '../../assets/lib/create-element.js';
import ProductCard from './product-card.js';

export default class ProductGrid {
    constructor(products) {
        this.products = products;
        this.filters = {};

        this.render();
        this.renderProducts(this.products);
    }

    render() {
        this.elem = createElement(`
    <div class="products-grid">
      <div class="products-grid__inner">
      </div>
    </div>
    `);
    }

    renderProducts() {
        let productsHolder = this.elem.querySelector('.products-grid__inner');
        productsHolder.innerHTML = '';

        for (let product of this.products) {
            if (product.nuts && this.filters.noNuts) {continue}
            if (!product.vegeterian && this.filters.vegeterianOnly) {continue}
            if (product.spiciness > this.filters.maxSpiciness && this.filters.maxSpiciness !== undefined) {continue}
            if (product.category !== this.filters.category && this.filters.category) {continue}

            let productTemplate = new ProductCard(product);
            productsHolder.appendChild(productTemplate.elem);
        }
    }

    updateFilter(filters) {
        Object.assign(this.filters, filters);
        this.renderProducts();
    }
}
