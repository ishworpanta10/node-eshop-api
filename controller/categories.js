const Categories = require("../models/categories");

exports.categories_get_all = async (req, res, next) => {
  const categoriesList = await Categories.find();
  res.send({
    count: categoriesList.length,
    categoriesList: categoriesList,
  });
  if (!categoriesList) {
    res.status(500).json({
      message: "No Categories",
      success: false,
    });
  }
};

exports.categories_post = (req, res, next) => {
  const categories = new Categories({
    name: req.body.name,
  });

  categories
    .save()
    .then((createdCategories) => {
      res.status(201).json(createdCategories);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
        success: false,
      });
    });
};
