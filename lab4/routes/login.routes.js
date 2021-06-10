const express = require("express");
const router = express.Router();
const User = require("../models/UserModel");

const renderProps = (err = undefined) => ({
  title: "Login",
  user: undefined,
  linkActive: "login",
  err
});

router.get("/", (_req, res) => {
  //####################### ZADATAK #######################
  //vrati login stranicu
  //#######################################################
  res.render("login", { ...renderProps() });
});

router.post("/", async (req, res) => {
  //####################### ZADATAK #######################
  //postupak prijave korisnika
  //#######################################################

  const user = await User.fetchByUsername(req.body.user);
  if (!user.isPersisted()) {
    return res.render("login", {
      ...renderProps("User not found")
    });
  }

  if (!user.checkPassword(req.body.password)) {
    return res.render("login", {
      // this should be the same as no user since this is kinda a security hole :)
      ...renderProps("Wrong password")
    });
  }

  req.session.user = user;

  res.redirect("/");
});

module.exports = router;
