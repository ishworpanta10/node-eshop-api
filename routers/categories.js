const express = require("express");

const router = express.Router();

const CategoriesController = require("../controller/categories");

router.get("/", CategoriesController.categories_get_all);

router.post("/", CategoriesController.categories_post);

module.exports = router;
