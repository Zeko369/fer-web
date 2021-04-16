// @ts-check
/// <reference path="./index.d.ts" />

const productURL = (id) => `https://web1lab2.azurewebsites.net/products/${id}`;
const cartBody = document.querySelector("#cart-body-items");

window.cache = [];

const loadCart = async () => {
  cartBody.innerHTML = "<p>Loading...</p>";

  const items = [];
  window.cache = [];
  // @ts-ignore, what?
  for (const [id, quantity] of Object.entries(window.cartService.items)) {
    const res = await fetch(productURL(id));
    const data = await res.json();

    window.cache.push(data);
    items.push({ ...data, quantity });
  }

  await renderCart(items);
};

const renderCart = async (items) => {
  /** @type {HTMLElement} */
  const rowTemplate = document.querySelector("#cart-template-item");
  cartBody.innerHTML = "";

  for (const item of items) {
    // @ts-ignore
    const template = rowTemplate.content.cloneNode(true);
    template.querySelector(".cart-item-title").textContent = item.name;
    template.querySelector(".cart-item-price").textContent = `${item.price} kn`;
    template.querySelector(".cart-item-quantity").value = item.quantity;

    cartBody.appendChild(template);
  }
};

/**
 * @param {string} key
 * @returns
 */
const compareFunction = (key) => {
  return (a, b) => (a[key] < b[key] ? -1 : 1);
};

/** * @param {string} key */
const sortBy = (key) => {
  const data = window.cache.map((item) => ({
    ...item,
    quantity: window.cartService.items[item.id]
  }));

  if (!["name", "price", "quantity"].includes(key)) {
    console.error("Wrong key");
    return;
  }

  const sorted = data.sort(compareFunction(key));
  renderCart(sorted);
};
