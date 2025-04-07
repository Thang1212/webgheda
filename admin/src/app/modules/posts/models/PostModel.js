const post = require("./tbl_post");

const path = require("path");
const fs = require("fs");

// Hàm xóa ảnh cũ của bài viết
const deleteOldImage = (post) => {
    if (!post || !post.post_image) return;

    const imagePath = path.join(__dirname, "../../../../../../uploads/public/", post.post_image);
    if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        console.log(`Đã xóa ảnh cũ: ${imagePath}`);
    }
    // // Xóa ảnh hiện tại
    // if (post.post_image && post.post_image.length > 0) {
    //     post.post_image.forEach(image => {
    //         const imagePath = path.join(__dirname, "../../../../../../uploads/public/", image);
    //         if (fs.existsSync(imagePath)) {
    //             fs.unlinkSync(imagePath);
    //             console.log(`Đã xóa ảnh liên quan: ${imagePath}`);
    //         }
    //     });
    // }
};


const data = { deleteOldImage };

// Export các hàm để sử dụng ở file khác
module.exports = data;