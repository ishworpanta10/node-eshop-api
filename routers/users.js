const express = require("express");

const router = express.Router();

const UserController = require("../controller/users");

router.get("/", UserController.user_get_all);

router.get("/:id", UserController.user_get_detail);

router.post("/", UserController.user_post);

router.put("/:id", UserController.user_update);

router.delete("/:id", UserController.user_delete);

router.get("/get/count", UserController.user_count);

// for login
router.post("/login", UserController.user_login);

// for register
router.post("/register", UserController.user_register);

module.exports = router;
