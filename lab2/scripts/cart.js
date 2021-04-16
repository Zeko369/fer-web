const productURL = (id) => `https://web1lab2.azurewebsites.net/products/${id}`;
const cartBody = document.querySelector("#cart-body-items");

const loadCart = async () => {
  cartBody.innerHTML = "<p>Loading...</p>";

  const items = [];
  for (const [id, quantity] of Object.entries(window.cartService.items)) {
    const res = await fetch(productURL(id));
    const data = await res.json();

    items.push({ ...data, quantity });
  }

  await renderCart(items);
};

const renderCart = async (items) => {
  const rowTemplate = document.querySelector("#cart-template-item");
  cartBody.innerHTML = "";

  console.log(rowTemplate);

  for (const item of items) {
    const template = rowTemplate.content.cloneNode(true);
    template.querySelector(".cart-item-title").textContent = item.name;
    template.querySelector(".cart-item-price").textContent = `${item.price} kn`;
    template.querySelector(".cart-item-quantity").value = item.quantity;

    cartBody.appendChild(template);
  }
};
