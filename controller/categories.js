const Categories = require("../models/categories");

exports.categories_get_all = async (req, res, next) => {
  const categoriesList = await Categories.find().select(
    "_id name icon color image"
  );
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

exports.categories_post = async (req, res, next) => {
  let category = new Categories({
    name: req.body.name,
    icon: req.body.icon,
    color: req.body.color,
    image: req.body.image,
  });

  category = await category.save();

  if (!category)
    return res.status(404).json({
      message: "category cannot be created",
    });

  res.send(category);

  // category
  //   .save()
  //   .then((createdCategory) => {
  //     res.status(201).json(createdCategory);
  //   })
  //   .catch((err) => {
  //     res.status(500).json({
  //       error: err,
  //       success: false,
  //     });
  //   });
};

exports.categories_delete = (req, res, next) => {
  const id = req.params.id;

  Categories.findByIdAndRemove(id)
    .then((category) => {
      if (category) {
        return res
          .status(200)
          .json({ success: true, message: "Category deleted successfully" });
      } else {
        return res.status(404).json({
          success: false,
          message: "Unabel to delete category",
        });
      }
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        error: err,
      });
    });
};
