import { Router } from "express";
import { query } from "../db/index.js";

export const itemRouter = Router();

itemRouter.get("/:id", async (req, res) => {
  /** @type {import("pg").QueryArrayResult<Record<string, any>>} */
  const itemRes = await query(
    `SELECT i.id,
            i.name,
            price,
            categoryid,
            imageurl,
            colors,
            c.name      as c_name,
            description as c_description,
            seasonal    as c_seasonal
         FROM inventory i
            JOIN categories c on i.categoryid = c.id
         WHERE i.id = $1
    `,
    [req.params.id]
  );

  if (itemRes.rowCount === 0) {
    return res.status(404).send("not found");
  }

  const item = itemRes.rows[0];

  res.render("item", {
    title: item["title"],
    linkActive: "order",
    item
  });
});
