const express = require("express");
const router = express.Router();
const PostController = require("../controllers/PostController");
const upload = require("@middleware/upload_images");
// Hiển thị danh sách sản phẩm trên giao diện
router.get("/", PostController.list_post);
router.get("/page/:id", PostController.list_post);

router.delete("/:id", PostController.destroy_post);
router.get("/edit/:id", PostController.edit_post);

// Route cập nhật bài viết, thêm `upload.single("post_image")`
router.put("/:id", upload.single("thumb_img"), PostController.update_post);
router.get("/add", PostController.add_post);
router.post("/create", upload.array("thumb_img", 1), PostController.create_post);
// router.post("/create", upload.array("thumb_img", 20), productController.add_product);

module.exports = {
    //url mặt đinh là http://localhost:5000/san-pham
    path: "/bai-viet",  //  Module mới có đường dẫn riêng
    router,
};