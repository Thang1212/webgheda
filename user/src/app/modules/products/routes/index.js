const express = require("express");
const router = express.Router();
const productController = require("../controllers/ProductController");
const upload = require("@middleware/multer");

// ============ trang ============ 
//url mặt đinh là http://localhost:5000/trang
router.get("/", productController.list_page); 

//url là http://localhost:5000/trang/add
router.get("/add", productController.add_page); 

router.get("/:id", productController.detail); 


module.exports = {
    //url mặt đinh là http://localhost:5000/trang
    path: "/san-pham",  //  Module mới có đường dẫn riêng
    router,
};