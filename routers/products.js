const express = require("express");

const router = express.Router();

const ProductController = require("../controller/products");

const multer = require("multer");

const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];

    let uploadError = new Error("invalid image type");

    if (isValid) {
      uploadError = null;
    }

    cb(uploadError, "public/uploads/");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(" ").join("-"); //we can also use .replace(" ","-")

    const extension = FILE_TYPE_MAP[file.mimetype];

    cb(null, `${fileName}_${Date.now()}.${extension}`);
  },
});

const uploadOptions = multer({ storage: storage });

// READ
router.get("/", ProductController.product_get_all);

router.get("/:id", ProductController.product_get);

//CREATE
router.post("/", uploadOptions.single("image"), ProductController.product_post);

// UPDATE
router.put("/:id", ProductController.product_update);

// DELETE
router.delete("/:id", ProductController.product_delete);

// CUSTOM ROUTES
router.get("/get/count", ProductController.product_count);
router.get("/get/featured/", ProductController.product_featured);
router.get("/get/featured/:count", ProductController.product_featured_count);

module.exports = router;
