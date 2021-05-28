import { join, dirname } from "path";
import express from "express";

import { homeRouter } from "./routes/home.routes.js";
import { orderRouter } from "./routes/order.routes.js";
import { itemRouter } from "./routes/item.routes.js";
import bodyParser from "body-parser";

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.set("views", join(dirname("."), "views"));
app.set("view engine", "ejs");

app.use(express.static(join(dirname("."), "public")));

app.use("/", homeRouter);
app.use("/order", orderRouter);
app.use("/item", itemRouter);

app.listen(3000, () => {
  console.log("Up on http://localhost:3000");
});
