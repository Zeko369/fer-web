import { Router } from "express";
import { query } from "../db/index.js";

export const orderRouter = Router();

orderRouter.get("/", async (req, res) => {
  /** @type {import("pg").QueryArrayResult<Record<string, any>>} */
  const inventory = await query(
    `SELECT i.id,
            i.name,
            price,
            categoryid,
            imageurl,
            colors,
            c.name      as c_name,
            description as c_description,
            seasonal    as c_seasonal
         FROM categories c
            LEFT JOIN inventory i on i.categoryid = c.id
    `
  );

  const categories = Object.fromEntries(
    inventory.rows.map((item) => [item["categoryid"], { name: item["c_name"] }])
  );

  const data = Object.entries(categories).map(([cId, cData]) => ({
    id: cId,
    ...cData,
    items: inventory.rows.filter((item) => item["categoryid"] === parseInt(cId))
  }));

  console.log(data);

  res.render("order", {
    title: "Order",
    linkActive: "order",
    categories: data
  });
});
