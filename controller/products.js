const mongoose = require("mongoose");

const Product = require("../models/products");
const Categories = require("../models/categories");

exports.product_get_all = async (req, res) => {
  // query param
  //http://localhost:3000/api/v1/products?categories=34567345,3456567
  let filter = {};
  if (req.query.categories) {
    filter = { category: req.query.categories.split(",") };
  }

  const productList = await Product.find(filter)
    .select("-__v")
    .populate("category", " -__v");
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

  if (!mongoose.isValidObjectId(id)) {
    return res.status(404).send({
      success: false,
      message: "Invalid Object Id",
    });
  }

  Product.findById(id)
    .populate("category", "-__v")
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
    return res
      .status(400)
      .send({ message: "Invalid Category", success: false });
  }

  // checking if file is send from frontend
  const file = req.file;
  if (!file) {
    return res
      .status(400)
      .send({ message: "Inage is required for the product", success: false });
  }

  // req.protocol return http
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

  const fileName = req.file.filename;

  let product = new Product({
    name: req.body.name,
    description: req.body.description,
    richDescription: req.body.richDescription,
    image: `${basePath}${fileName}`,
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

exports.product_update = async (req, res) => {
  const id = req.params.id;
  // checking if valid obj id
  if (!mongoose.isValidObjectId(id)) {
    return res.status(404).send({
      success: false,
      message: "Invalid Object Id",
    });
  }
  // validating category
  const category = await Categories.findById(req.body.category);
  if (!category) {
    return res
      .status(400)
      .send({ message: "Invalid Category" })
      .catch((err) => {
        console.log("error", err);
      });
  }

  const product = await Product.findByIdAndUpdate(
    id,
    {
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: req.body.image ?? "",
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
    },
    {
      new: true,
    }
  );

  if (!product) {
    return res.status(404).send({
      message: "Product cannot be updated",
    });
  }

  res.status(200).send(product);
};

exports.product_delete = (req, res, next) => {
  const id = req.params.id;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(404).send({
      success: false,
      message: "Invalid Object Id",
    });
  }

  Product.findByIdAndRemove(id)
    .then((product) => {
      if (product) {
        return res.status(200).json({
          success: true,
          message: "product deleted successfully",
        });
      } else {
        return res.status(404).send({
          success: false,
          message: "Unable to delete product",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        success: false,
        error: err,
      });
    });
};

// custom api for count
exports.product_count = async (req, res, next) => {
  const productCount = await Product.countDocuments((count) => count);

  // for no products
  if (!productCount) {
    res.status(500).json({
      message: "No Products",
      success: false,
    });
  }

  res.send({
    count: productCount,
  });
};

exports.product_featured = async (req, res, next) => {
  const featuredProducts = await Product.find({ isFeatured: true });

  // for no products
  if (!featuredProducts) {
    res.status(500).json({
      message: "No featured Products",
    });
  }

  res.send({
    count: featuredProducts.length,
    featuredProducts: featuredProducts,
  });
};

exports.product_featured_count = async (req, res, next) => {
  const count = req.params.count ? req.params.count : 0;

  const featuredProducts = await Product.find({ isFeatured: true }).limit(
    +count
  );

  // for no products
  if (!featuredProducts) {
    res.status(500).json({
      message: "No featured Products",
    });
  }

  res.send({
    count: featuredProducts.length,
    featuredProducts: featuredProducts,
  });
};

//for uploading the gallery images we use separate api and update product model as:
exports.gallery_images = async (req, res) => {
  const id = req.params.id;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(404).send({
      success: false,
      message: "Invalid Object Id",
    });
  }

  const files = req.files;

  let imagePaths = [];

  // req.protocol return http
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

  if (files) {
    files.map((file) => {
      imagePaths.push(`${basePath}${file.filename}`);
    });
  }

  const product = await Product.findByIdAndUpdate(
    id,
    {
      images: imagePaths,
    },
    {
      new: true,
    }
  );

  if (!product) {
    return res.status(404).send({
      message: "product gallery images cannot be uploaded",
    });
  }

  res.status(200).send(product);
};
