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

// CUSTOM ROUTES
router.get("/get/count", ProductController.product_count);
router.get("/get/featured/", ProductController.product_featured);
router.get("/get/featured/:count", ProductController.product_featured_count);

module.exports = router;
