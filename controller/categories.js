const { readFile } = require("fs");
const Categories = require("../models/categories");

exports.categories_get_all = async (req, res, next) => {
  const categoriesList = await Categories.find().select(
    "_id name icon color image"
  );
  res.status(200).send({
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

exports.categories_get_detail = async (req, res, next) => {
  const id = req.params.id;
  // const category = await Categories.findById(id);
  // if (!category) {
  //   res.status(404).json({
  //     success: false,
  //     message: "category not found",
  //   });
  // }
  // res.status(200).send(category);
  // alternative
  Categories.findById(id)
    .then((catagory) => {
      if (catagory) {
        res.status(200).json(catagory);
      } else {
        res.status(404).json({
          success: false,
          message: "category not found",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        error: err,
      });
    });
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

exports.categories_update = async (req, res, next) => {
  const id = req.params.id;

  const category = await Categories.findByIdAndUpdate(
    id,
    {
      name: req.body.name,
      icon: req.body.icon,
      color: req.body.color,
      image: req.body.image ?? "",
    },
    {
      new: true,
    }
  );
  if (!category) {
    res.status(404).json({ message: "Category cannot be updated" });
  }

  res.status(200).send(category);
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
          message: "Unable to delete category",
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
