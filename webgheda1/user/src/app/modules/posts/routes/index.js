const express = require("express");
const router = express.Router();
const postController = require("../controllers/PostController");
const upload = require("@middleware/multer");

// ============ trang ============ 
//url mặt đinh là http://localhost:5000/trang
router.get("/", postController.list_post); 


router.get("/:id", postController.detail); 


module.exports = {
    //url mặt đinh là http://localhost:5000/trang
    path: "/bai-viet",  //  Module mới có đường dẫn riêng
    router,
};