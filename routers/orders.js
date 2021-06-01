const express = require("express");

const router = express.Router();

const OrdersController = require("../controller/orders");

router.get("/", OrdersController.order_get_all);

router.get("/:id", OrdersController.order_get_detail);

router.post("/", OrdersController.order_post);

router.put("/:id", OrdersController.order_update);

router.delete("/:id", OrdersController.order_delete);

// total sales
router.get("/get/totalsales", OrdersController.order_total_sales);

router.get("/get/ordercount", OrdersController.order_count);

// getting total order of specific user
router.get("/get/userorders/:userId", OrdersController.get_user_order_list);

module.exports = router;
