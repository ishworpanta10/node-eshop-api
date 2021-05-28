const express = require("express");

const router = express.Router();

const ProductController = require("../controller/products");

router.get("/", ProductController.product_get_all);

router.post("/", ProductController.product_post);

module.exports = router;
