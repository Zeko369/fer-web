import { Router } from "express";

export const homeRouter = Router();

homeRouter.get("/", (req, res) => {
  res.render("home", { title: "Home", linkActive: "home" });
});
