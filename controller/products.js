const Product = require("../models/products");
const Categories = require("../models/categories");

exports.product_get_all = async (req, res) => {
  const productList = await Product.find()
    .select("-_id -__v")
    .populate("category", "-_id -__v");
  res.send({
    count: productList.length,
    productList: productList,
  });
  // for no products
  if (!productList) {
    res.status(500).json({
      message: "No Products",
      success: false,
    });
  }
};

exports.product_get = async (req, res) => {
  const id = req.params.id;

  Product.findById(id)
    .populate("category", "-_id -__v")
    .then((product) => {
      if (product) {
        res.status(200).json(product);
      } else {
        res.status(404).json({
          success: false,
          message: "product not found",
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

// let product = await Product.findById(id);
// if (!product) {
//   return res.status(404).send({
//     success: false,
//     message: "Product not available",
//   });
// }

// res.status(200).send(product);
// };

exports.product_post = async (req, res) => {
  // creating product from FrontEnd and pushing to db

  const category = await Categories.findById(req.body.category);
  if (!category) {
    return res.status(400).send({ message: "Invalid Category" });
  }

  let product = new Product({
    name: req.body.name,
    description: req.body.description,
    richDescription: req.body.richDescription,
    image: req.body.image,
    images: req.body.images,
    brand: req.body.brand,
    price: req.body.price,
    category: req.body.category,
    countInStock: req.body.countInStock,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
    isFeatured: req.body.isFeatured,
  });

  product = await product.save();
  if (!product) {
    return res.status(500).json({
      message: "product cannot be created",
    });
  }
  res.send(product);
  // product
  //   .save()
  //   .then((createdProduct) => {
  //     res.status(201).json(createdProduct);
  //   })
  //   .catch((err) => {
  //     res.status(500).json({
  //       error: err,
  //       success: false,
  //     });
  //   });
};
