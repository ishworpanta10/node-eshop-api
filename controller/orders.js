const mongoose = require("mongoose");

const Order = require("../models/orders");
const OrderItem = require("../models/order-items");

exports.order_get_all = async (req, res) => {
  const orderList = await Order.find()
    .populate("users", "name", "email")
    // populate order based on ordered date
    // .sort("dateOrdered");
    // newest to oldest
    .sort({
      dateOrdered: -1,
    });

  if (!orderList) {
    return res.status(500).send({
      message: "Order not found",
      success: false,
    });
  }

  res.status(200).send({
    count: orderList.length,
    orderList: orderList,
  });
};

exports.order_get_detail = async (req, res) => {
  const id = req.params.id;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(404).send({
      success: false,
      message: "Invalid Object Id",
    });
  }

  const order = await Order.findById(id)
    .populate("users", "name", "email")

    // for populating orderItems
    // .populate('orderItems');

    // for populating orderItems with produst details
    // .populate({
    //   path: "orderItems",
    //   populate: "product",
    // });

    // for populating orderItems with product details along with category populate
    .populate({
      path: "orderItems",
      populate: {
        path: "product",
        populate: "category",
      },
    })
    .sort({ dateOrdered: -1 });

  if (!order) {
    return res.status(500).send({
      message: "Order not found",
      success: false,
    });
  }

  res.status(200).json({
    order: order,
  });
};

exports.order_post = async (req, res) => {
  const orderItemsIds = Promise.all(
    req.body.orderItems.map(async (orderItem) => {
      let newOrderItem = new OrderItem({
        quantity: orderItem.quantity,
        product: orderItem.product,
      });

      newOrderItem = await newOrderItem.save();

      return newOrderItem._id;
    })
  );
  // need to resolve all order items at once by using Promise.all and awaiting the resolved ids;
  const orderItemsIdsResolved = await orderItemsIds;

  // console.log(orderItemsIdsResolved);

  // calculating total price from database
  const totalPrices = await Promise.all(
    orderItemsIdsResolved.map(async (orderItemsId) => {
      const orderItem = await OrderItem.findById(orderItemsId).populate(
        "product",
        "price"
      );

      const totalPrice = orderItem.product.price * orderItem.quantity;
      console.log(totalPrice);
      return totalPrice;

      // this return the array of product price as : [200, 400]
    })
  );

  console.log(totalPrices);
  // initial value is 0 and combine a and b
  const totalPrice = totalPrices.reduce((a, b) => a + b, 0);

  let order = new Order({
    orderItems: orderItemsIdsResolved,
    shippingAddress1: req.body.shippingAddress1,
    shippingAddress2: req.body.shippingAddress2,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
    phone: req.body.phone,
    status: req.body.status,
    totalPrice: totalPrice,
    user: req.body.user,
  });
  order = await order.save();

  if (!order) return res.status(400).send("the order cannot be created!");

  res.send(order);
};

exports.order_update = async (req, res) => {
  const id = req.params.id;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(404).send({
      success: false,
      message: "Invalid Object Id",
    });
  }

  const order = await Order.findByIdAndUpdate(
    id,
    {
      status: req.body.status,
    },
    {
      new: true,
    }
  );
  if (!order) {
    res.status(404).json({ message: "Order cannot be updated" });
  }

  res.status(200).send(order);
};

exports.order_delete = (req, res) => {
  const id = req.params.id;

  Order.findByIdAndRemove(id)
    .then(async (order) => {
      if (order) {
        //   deleting order-items table data after deleting order
        //   cascading delete
        //   we are storing only id in order table in mongoose so delete by orderItem

        await order.orderItems.map(async (orderItem) => {
          await OrderItem.findByIdAndRemove(orderItem);
        });
        return res.status(200).json({
          success: true,
          message: "Order deleted successfully",
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "Unable to delete order",
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

exports.order_total_sales = async (req, res) => {
  // totalPrice is the field in Order table
  const totalSales = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalsales: {
          $sum: "$totalPrice",
        },
      },
    },
  ]);

  if (!totalSales) {
    return res.status(400).send({
      message: "Order sales cannot be generated",
    });
  }

  //   res.status(200).send({
  //     totalSales: totalSales,
  //   });
  // we can pop item in array to show only totalsales as:
  res.status(200).send({
    totalsales: totalSales.pop().totalsales,
  });
};

// custom api for count
exports.order_count = async (req, res, next) => {
  const orderCount = await Order.countDocuments((count) => count);

  // for no products
  if (!orderCount) {
    res.status(500).json({
      message: "No Orders",
      success: false,
    });
  }

  res.send({
    count: orderCount,
    success: true,
  });
};

exports.get_user_order_list = async (req, res, next) => {
  const userOrderedList = await Order.find({
    user: req.params.userId,
  }).populate({
    path: "orderItems",
    populate: {
      path: "product",
      populate: "category",
    },
  });

  if (userOrderedList.length === 0) {
    res.status(200).json({
      message: "No User Orders",
      success: true,
    });
  }

  if (!userOrderedList) {
    res.status(500).json({
      message: "Error getting user order",
      success: false,
    });
  }
  res.status(200).send({
    count: userOrderedList.length,
    userOrderList: userOrderedList,
  });
};
