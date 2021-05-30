const express = require("express");

const router = express.Router();

const ProductController = require("../controller/products");

// READ
router.get("/", ProductController.product_get_all);

router.get("/:id", ProductController.product_get);

//CREATE
router.post("/", ProductController.product_post);

// UPDATE
router.put("/:id", ProductController.product_update);

// DELETE
router.delete("/:id", ProductController.product_delete);

module.exports = router;
