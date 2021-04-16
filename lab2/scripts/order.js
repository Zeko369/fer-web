const getData = async () => {
  const response = await fetch("https://web1lab2.azurewebsites.net/categories");
  const data = await response.json();

  await addCategories(data);
};

const addCategories = async (categories) => {
  const main = document.querySelector("main");
  const categoryTemplate = document.querySelector("#category-template");
  const productTemplate = document.querySelector("#product-template");

  for (let index = 0; index < categories.length; index++) {
    const category = categories[index];
    const URL = `https://web1lab2.azurewebsites.net/products?categoryId=${category.id}`;
    const res = await fetch(URL);

    /** @type {{ "id": number, "name": string, "price": number, "categoryId": number, "imageUrl": string}[]} */
    const data = await res.json();

    if (data.length > 0) {
      /** @type {HTMLElement} */
      const template = categoryTemplate.content.cloneNode(true);
      template.querySelector(".decorated-title > span").textContent = category.name;

      data.forEach((product) => {
        /** @type {HTMLElement} */
        const tmp = productTemplate.content.cloneNode(true);
        tmp.querySelector(".photo-box").setAttribute("data-id", product.id);
        tmp.querySelector(".photo-box-image").style.backgroundImage = `url("${product.imageUrl}")`;
        tmp.querySelector(".photo-box-title").innerText = product.name;
        tmp.querySelector(".cart-btn").addEventListener("click", () => {
          window.cartService.addToCart(product.id);
        });

        template.querySelector(".gallery").appendChild(tmp);
      });

      main.appendChild(template);
    }
  }
};
