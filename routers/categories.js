const express = require("express");

const router = express.Router();

const CategoriesController = require("../controller/categories");

router.get("/", CategoriesController.categories_get_all);

router.get("/:id", CategoriesController.categories_get_detail);

router.post("/", CategoriesController.categories_post);

router.put("/:id", CategoriesController.categories_update)

router.delete("/:id", CategoriesController.categories_delete);

module.exports = router;
