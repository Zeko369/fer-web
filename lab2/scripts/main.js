// @ts-check
/// <reference path="./index.d.ts" />

const STORE_KEY = "fp:items";

class CartService {
  /** @type {Record<number, number>} */
  items = {};

  constructor() {
    this.loadItems();
  }

  /**
   * Method for adding products to cart
   * @param {number} id
   */
  addToCart(id) {
    if (!this.items[id]) {
      this.items[id] = 0;
    }

    this.items[id]++;
    this.update();
  }

  /** @private */
  update() {
    this.updateNavBar();
    this.saveItems();
  }

  updateNavBar() {
    /** @type {HTMLDivElement} */
    const count = document.querySelector("nav.navigation #cart-items");
    count.innerText = Object.keys(this.items)
      .reduce((all, curr) => {
        return all + this.items[curr];
      }, 0)
      .toString();
  }

  /** @private */
  loadItems() {
    const tmp = window.localStorage.getItem(STORE_KEY);
    if (tmp) {
      this.items = JSON.parse(tmp);
      return;
    }

    this.items = {};
  }

  /** @private */
  saveItems() {
    window.localStorage.setItem(STORE_KEY, JSON.stringify(this.items));
  }
}

const cartService = new CartService();
window.cartService = cartService;

window.addEventListener("load", () => {
  cartService.updateNavBar();
});
