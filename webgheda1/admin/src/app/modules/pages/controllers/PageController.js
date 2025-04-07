const { get_layout } = require("@helper/template");
const { formatDate } = require("@helper/format"); // Import helper
const tbl_page = require("../models/tbl_page");

// ================== Trang ==================

// 1. Hiển thị danh sách Page
exports.list_page = async (req, res) => {
  const perPage = 6; // Số sản phẩm trên mỗi trang
  const page = parseInt(req.params.id) || 1; // Lấy số trang từ query hoặc mặc định là trang 1
  const totalPages = await tbl_page.countDocuments();     // Đếm tổng số sản phẩm
  const status_vn = {
    draft: "Bản nháp",
    published: "Đã Đăng",
  };
  try {
    // Gọi hàm getProducts() để lấy danh sách sản phẩm theo trang
    const pages = await tbl_page.find().populate("admin_id", "username").skip((page - 1) * perPage).limit(perPage);
    pages.forEach(page => {
      page.page_status = status_vn[page.page_status] || "Không xác định";
    });
    // console.log(pages);
    const data = {
      get_layout,
      pages, // truyền vào view
      formatDate,
      currentPage: page,
      totalPages: Math.ceil(totalPages / perPage), // Tổng số trang
      stt_page: (page - 1) * perPage,
    };
    res.render("list_page", data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Lỗi server!");
  }
};

// 2. Hiện giao diện thêm Page
exports.add_page = (req, res) => {
  const data = {
    get_layout,
  };
  res.render("add_page", data);
};

// 3. Xử lý thêm Page
exports.create_page = async (req, res) => {
  try {
    // 👉 Thêm dòng này để xem dữ liệu form gửi về là gì
    // console.log("Dữ liệu req.body:", req.body);
    // const { title, slug, content } = req.body;
    const { title, slug, detail, status } = req.body;
    const newPage = new tbl_page({
      page_title: title,
      page_slug: slug,
      page_content: detail,
      page_status: status,
      admin_id: req.session.user.id, // ✅ Lưu ObjectId của admin
    });
    await newPage.save();
    // res.json("hello");
    res.redirect("/trang");
  } catch (err) {
    console.error("Lỗi khi thêm page:", err);
    res.status(500).send("Thêm trang thất bại!");
  }
};

// 4. Hiện form sửa Page
exports.edit_page = async (req, res) => {
  try {
    const page = await tbl_page.findById(req.params.id).populate("admin_id", "username");
    if (!page) {
      return res.status(404).send("Không tìm thấy trang!");
    }

    const data = {
      get_layout,
      page,
      formatDate,
    };
    console.log(page);
    res.render("edit_page", data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Lỗi khi load form sửa!");
  }
};

// 5. Xử lý sửa Page
exports.update_page = async (req, res) => {
  try {
    const pageId = req.params.id;
    const { title, slug, detail, status } = req.body;
    // Cập nhật dữ liệu trong MongoDB
    await tbl_page.findByIdAndUpdate(
      pageId,
      {
        page_title: title,
        page_slug: slug,
        page_content: detail, // Thay vì "desc"
        page_status: status,
      },
      { new: true }
    );
    res.redirect("/trang");
  } catch (err) {
    console.error(err);
    res.status(500).send("Cập nhật trang thất bại!");
  }
};

// 6. Xóa Page
exports.delete_page = async (req, res) => {
  try {
    await tbl_page.findByIdAndDelete(req.params.id);
    res.redirect("/trang");
  } catch (err) {
    console.error(err);
    res.status(500).send("Xóa trang thất bại!");
  }
};
