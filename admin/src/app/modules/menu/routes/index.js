const express = require("express");
const router = express.Router();
const menuController = require("../controllers/menuController");
const upload = require("@middleware/upload_images");


// ============ slider ============ 
//url mặt đinh là http://localhost:5000/slider
router.get("/", menuController.get_menu); 

//url là http://localhost:5000/slider/add
// router.get("/add", productController.add_page); 

module.exports = {
    //url mặt đinh là http://localhost:5000/slider
    path: "/menu",  //  Module mới có đường dẫn riêng
    router,
};