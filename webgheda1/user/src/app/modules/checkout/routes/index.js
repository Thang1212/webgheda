const express = require("express");
const router = express.Router();
const cartController = require("../controllers/CheckoutController");
const upload = require("@middleware/multer");

// ============ trang ============ 
//url mặt đinh là http://localhost:5000/trang
router.get("/", cartController.checkout); 


// router.get("/:id", cartController.detail); 


module.exports = {
    //url mặt đinh là http://localhost:5000/trang
    path: "/thanh-toan",  //  Module mới có đường dẫn riêng
    router,
};