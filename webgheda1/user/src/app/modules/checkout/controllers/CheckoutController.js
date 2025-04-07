const { get_layout } = require("@helper/template"); // == ko xóa==

// quire("../models/pageModel");

exports.checkout = async (req, res) => {
    const data = {
        get_layout,
    }
    res.render("checkout", data);

};

// ========= add========
//  Cách thực hiện
// Lấy dữ liệu từ req.body do người dùng nhập vào form.
// Tạo một document mới trong MongoDB dựa trên model Product.
// Lưu sản phẩm vào database và xử lý lỗi nếu có.
// Hiển thị thông báo khi thêm thành công hoặc thất bại.