const express = require("express");
const router = express.Router();

router.get("/", function (req, res, next) {
  //####################### ZADATAK #######################
  // - obrisati sadržaj košarice
  // - odjaviti registriranog korisnika iz sustava
  // - napraviti redirect na osnovnu stranicu
  //#######################################################

  req.session.cart = undefined;
  req.session.user = undefined;

  res.redirect("/");
});

module.exports = router;
