import { Router } from "express";
import { query } from "../db/index.js";
import { body, validationResult } from "express-validator";

export const itemRouter = Router();

itemRouter.get("/:id", async (req, res) => {
  /** @type {import("pg").QueryArrayResult<Record<string, any>>} */
  const itemRes = await query(
    `SELECT i.id,
            i.name,
            price,
            imageurl,
            colors,
            c.id            as c_id,
            c.name          as c_name,
            c.description   as c_description,
            c.seasonal      as c_seasonal,
            s.id            as s_id,
            s.name          as s_name,
            s.email         as s_email,
            s.country       as s_country,
            s.county        as s_county,
            s.suppliersince as s_since
     FROM inventory i
              JOIN categories c ON i.categoryid = c.id
              LEFT JOIN suppliers s ON s.supplierfor = i.id
     WHERE i.id = $1
     ORDER BY s.id
    `,
    [req.params["id"]]
  );

  if (itemRes.rowCount === 0) {
    return res.status(404).send("not found");
  }

  const item = itemRes.rows.reduce(
    /**
     * @param item {{suppliers: any[]}}
     * @param row
     * @returns {any}
     */
    (item, row) => {
      if (row["s_name"] !== null) {
        item.suppliers.push(
          Object.fromEntries(
            Object.keys(row)
              .filter((k) => k.startsWith("s_"))
              .map((k) => [k.slice(2), row[k]])
          )
        );
      }

      const category = Object.fromEntries(
        Object.keys(row)
          .filter((k) => k.startsWith("c_"))
          .map((k) => [k.slice(2), row[k]])
      );

      const data = Object.fromEntries(
        Object.keys(row)
          .filter((k) => k[1] !== "_")
          .map((k) => [k, row[k]])
      );

      return { ...data, category, suppliers: item.suppliers };
    },
    { suppliers: [] }
  );

  return res.render("item", {
    title: item["title"],
    linkActive: "order",
    item
  });
});

itemRouter.get("/:id/editsupplier/:supplier_id", async (req, res) => {
  /** @type {import("pg").QueryArrayResult<Record<string, any>>} */
  const raw = await query(
    `SELECT s.*, i.name as item_name
     FROM suppliers s
              JOIN inventory i on s.supplierfor = i.id
     WHERE s.id = $1
    `,
    [req.params["supplier_id"]]
  );

  const supplier = raw.rows[0];
  if (raw.rowCount === 0 || !supplier) {
    return res.status(404).send("Not found");
  }

  return res.render("editSupplier", {
    title: `Edit: ${supplier["name"]}`,
    linkActive: "order",
    supplier
  });
});

const validateUpdateSupplier = [
  body("name").not().isEmpty().trim().isLength({ min: 2, max: 22 }),
  body("country").not().isEmpty().trim().isLength({ min: 2, max: 22 }),
  body("county").not().isEmpty().trim().isLength({ min: 2, max: 22 }),
  body("email").not().isEmpty().isEmail(),
  body("suppliersince").not().isEmpty().isInt({ min: 1945, max: 2021 })
];

itemRouter.post("/:id/editsupplier/:supplier_id", validateUpdateSupplier, async (req, res) => {
  console.log(req.body);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return res.render("error", {
      title: "Error Edit Supplier",
      linkActive: "order",
      itemID: req.params["id"],
      errors: errors.array()
    });
  }

  /** @type {import("pg").QueryArrayResult<Record<string, any>>} */
  const raw = await query(
    `SELECT s.*
     FROM suppliers s
     WHERE s.id = $1 `,
    [req.params["supplier_id"]]
  );

  const supplier = raw.rows[0];
  if (raw.rowCount === 0 || !supplier) {
    return res.status(404).send("Not found");
  }

  try {
    await query(
      `UPDATE suppliers
       SET name          = $1,
           country       = $2,
           county        = $3,
           email         = $4,
           suppliersince = $5
       WHERE id = $6
      `,
      [
        req.body["name"],
        req.body["country"],
        req.body["county"],
        req.body["email"],
        parseInt(req.body["suppliersince"]),
        req.params["supplier_id"]
      ]
    );
  } catch (err) {
    return res.render("error", {
      title: "Error Edit Supplier",
      linkActive: "order",
      itemID: req.params["id"],
      errors: errors.array()
    });
  }

  return res.redirect(`/item/${supplier["supplierfor"]}`);
});
