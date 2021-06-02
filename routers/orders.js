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

// post eg of order
// {
//     "orderItems" : [
//         {
//             "quantity": 3,
//             "product" : "60b35cef353ce8f734bd9c0c"
//         },
//         {
//             "quantity": 2,
//             "product" : "60b70be0999c4d2088cc5be7"
//         }
//     ],
//     "shippingAddress1" : "Salyantar 1 Basaulagaun",
//     "shippingAddress2" : "salyantar",
//     "city": "Salyantar",
//     "zip": "4600",
//     "country": "Nepal",
//     "phone": "9843750658",
//     "user": "60b70ad0999c4d2088cc5be6"
// }
