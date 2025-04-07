const { get_layout } = require("@helper/template"); // == ko xóa==

// quire("../models/pageModel");

const Page = require('../../pages/models/tbl_page'); // Import model
const Product_cat = require('../../products/models/tbl_product_cat'); // Import model


exports.get_menu = async (req, res) => {
    try {
        const pages = await Page.find({ page_status: 'published' }); // Lấy tất cả các page đã publish
        const product_cat = await Product_cat.find(); // Lấy tất cả các page đã publish
        const data = {
            get_layout,
            product_cat,
            pages
        }
        // console.log(product_cat);
        res.render('list_menu', data); // Truyền pages vào view
    } catch (error) {
        console.error(error);
        res.status(500).send('Lỗi server');
    }
};
// Hiện giao diện thêm sản phẩm
// exports.add_page = async (req, res) => {
//     const data = {
//         get_layout,
//     }
//     res.render("add_page", data);
// };

// ========= add========
//  Cách thực hiện
// Lấy dữ liệu từ req.body do người dùng nhập vào form.
// Tạo một document mới trong MongoDB dựa trên model Product.
// Lưu sản phẩm vào database và xử lý lỗi nếu có.
// Hiển thị thông báo khi thêm thành công hoặc thất bại.