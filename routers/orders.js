const express = require("express");

const router = express.Router();

const OrdersController = require("../controller/orders");

router.get("/", OrdersController.order_get_all);

router.get("/:id", OrdersController.order_get_detail);

router.post("/", OrdersController.order_post);

router.put("/:id", OrdersController.order_update);

router.delete("/:id", OrdersController.order_delete);

module.exports = router;
