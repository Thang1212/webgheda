const { get_layout } = require("@helper/template");
// const { formatDate } = require("@helper/format"); // Import helper
exports.list_order = async (req, res) => {
    const data = { get_layout };
    res.render("list_order", data);
};

exports.detail_order = async (req, res) => {
    const data = { get_layout };
    res.render("edit_order", data);
};

// ========= add========
//  Cách thực hiện
// Lấy dữ liệu từ req.body do người dùng nhập vào form.
// Tạo một document mới trong MongoDB dựa trên model Product.
// Lưu sản phẩm vào database và xử lý lỗi nếu có.
// Hiển thị thông báo khi thêm thành công hoặc thất bại.