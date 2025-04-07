const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/OrderController");
const upload = require("@middleware/upload_images");


// ============ Sản phẩm ============ 
router.get("/", OrderController.list_order); // Trang chính (mặc định là trang 1)
router.get("/detail", OrderController.detail_order); // Trang chính (mặc định là trang 1)



module.exports = {
    //url mặt đinh là http://localhost:5000/san-pham
    path: "/ban-hang",  //  Module mới có đường dẫn riêng
    router,
};