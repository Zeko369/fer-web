const express = require("express");
const router = express.Router();
const cart = require("../models/CartModel");
const cartExistence = require("./helpers/cart-existence");
const cartSanitizer = require("./helpers/cart-sanitizer");

// Ulančavanje funkcija međuopreme
router.get("/", cartSanitizer, function (req, res, next) {
  //####################### ZADATAK #######################
  // prikaz košarice uz pomoć cart.ejs
  //#######################################################

  res.render("cart", {
    title: "Cart",
    user: req.session.user,
    linkActive: "cart",
    cart: req.session.cart,
    err: undefined
  });
});

router.get("/add/:id", async (req, res, next) => {
  //####################### ZADATAK #######################
  //dodavanje jednog artikla u košaricu
  //#######################################################

  if (!req.session.cart) {
    req.session.cart = cart.createCart();
  }

  console.log("add");

  await cart.addItemToCart(req.session.cart, req.params.id, 1);
  res.send("ok");
});

router.get("/remove/:id", cartExistence, async (req, res, next) => {
  //####################### ZADATAK #######################
  //brisanje jednog artikla iz košarice
  //#######################################################

  await cart.removeItemFromCart(req.session.cart, req.params.id, 1);
  res.send("ok");
});

module.exports = router;
