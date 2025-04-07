const { get_layout } = require("@helper/template");
const { formatDate } = require("@helper/format"); // Import helper
const { addProduct,
    getProductId,
    updatedProduct,
    countProduct,
    deletedProduct,
    getListCategories,
    getProductsPaging,
    deleteOldImages } = require("../models/productModel");
const {
    getProductCat,
} = require("../models/productCatModel");

exports.list_product = async (req, res) => {
    // console.log(req.session.user);  // In ra thông tin người dùng trong session
    const perPage = 6; // Số sản phẩm trên mỗi trang
    const page = parseInt(req.params.id) || 1; // Lấy số trang từ query hoặc mặc định là trang 1
    const totalProducts = await countProduct();     // Đếm tổng số sản phẩm
    const status_vn = {
        active: "Đang hoạt động",
        inactive: "Không hoạt động",
        out_of_stock: "Hết hàng"
    };
    try {
        // Gọi hàm getProducts() để lấy danh sách sản phẩm theo trang
        const products = await getProductsPaging(page, perPage);
        const cat_name = await getListCategories();
        products.forEach(product => {
            product.product_status = status_vn[product.product_status] || "Không xác định";
            product.category_name = cat_name[product.category_id] || "Không xác định";
        });
        // console.log(products);
        const data = {
            // cat_name,
            get_layout,
            products,
            currentPage: page,
            totalPages: Math.ceil(totalProducts / perPage), // Tổng số trang
            stt_product: (page - 1) * perPage,
        }
        // console.log(products); // Kiểm tra toàn bộ danh sách sản phẩm
        res.render("list_product", data);
    } catch (error) {
        console.error(error);
        res.status(500).send("Lỗi khi lấy danh sách sản phẩm!");
    }
};
// Hiện giao diện thêm sản phẩm
exports.show_add_product = async (req, res) => {
    const listProductCat = await getProductCat();
    const data = { get_layout, listProductCat }
    res.render("add_product", data);
};

exports.add_product = async (req, res) => {
    try {
        const { title, slug, desc, detail, status, stock_quantity, new_price, old_price, is_featured, product_cat } = req.body;
        // Kiểm tra dữ liệu bắt buộc
        // console.log(req.body);
        if (!title || !slug || !new_price || !stock_quantity) {
            throw new Error("Vui lòng nhập đầy đủ thông tin sản phẩm!");
        }
        // Kiểm tra nếu có nhiều ảnh
        const imagePaths = req.files ? req.files.map(file => `/images/uploads/${file.filename}`) : [];
        // console.log("Dữ liệu req.files:", req.files);
        const productData = {
            product_name: title,
            product_slug: slug,
            product_desc: desc,
            product_details: detail,
            stock_quantity: Number(stock_quantity),
            product_new_price: Number(new_price),
            product_old_price: Number(old_price),
            is_featured: Number(is_featured),
            featured_image: imagePaths[0],
            product_status: status,
            category_id: product_cat,
            product_images: imagePaths, // Lưu danh sách ảnh
            admin_id: req.session.user.id, // ✅ Lưu ObjectId của admin
        };
        await addProduct(productData);
        res.redirect("/sanpham")
        // res.render("add_product", { get_layout, productCat });
        // res.render("add_product", { get_layout, message: "Sản phẩm đã được thêm thành công!" });
    } catch (error) {
        console.error(error);
        res.render("add_product", { get_layout, productCat, error: error.message || "Có lỗi xảy ra!" });
    }
};

// Hiện edit sản phẩm
exports.edit_product = async (req, res) => {
    try {
        const id = req.params.id;
        // Kiểm tra xem sản phẩm có tồn tại không
        const product = await getProductId(id);
        const listProductCat = await getProductCat();
        // Lấy category_id hiện tại của sản phẩm (chuyển thành String để so sánh)
        const product_cat = product.category_id ? product.category_id.toString() : ""; //Đúng: Chuyển ObjectId thành String
        const data = { get_layout, product, formatDate, listProductCat, product_cat };
        res.render("edit_product", data); // Render trang chỉnh sửa
    } catch (error) {
        console.error(error);
        res.status(500).send("Lỗi khi lấy thông tin sản phẩm!");
    }
}

exports.update_product = async (req, res) => {
    try {
        const listProductCat = await getProductCat();
        const id = req.params.id;
        const { title, slug, stock_quantity, new_price, old_price, desc, detail, is_featured, status, selected_img, product_cat } = req.body;
        const imagePaths = req.files ? req.files.map(file => `/images/uploads/${file.filename}`) : [];
        // Kiểm tra xem sản phẩm có tồn tại không
        let product = await getProductId(id);
        if (!title || !slug || !new_price || !stock_quantity) {
            throw new Error("Vui lòng nhập đầy đủ thông tin sản phẩm!");
        }
        // Cập nhật danh sách ảnh: Nếu có ảnh mới, thay toàn bộ ảnh cũ; nếu không, giữ nguyên
        const updatedImages = imagePaths.length > 0 ? imagePaths : product.product_images;
        // Nếu không có selected_img, dùng ảnh đầu tiên trong danh sách ảnh mới
        if (imagePaths.length > 0) {
            const product = await getProductId(id); // Lấy sản phẩm theo ID
            deleteOldImages(product); // Xóa ảnh cũ
        }
        const productData = {
            id,
            product_name: title,
            product_slug: slug,
            product_desc: desc,
            product_details: detail,
            stock_quantity: Number(stock_quantity),
            product_new_price: Number(new_price),
            product_old_price: Number(old_price),
            is_featured: Number(is_featured),
            featured_image: selected_img,
            product_status: status,
            category_id: product_cat,
            product_images: updatedImages, // Lưu danh sách ảnh
        };
        // Cập nhật sản phẩm trong database
        await updatedProduct(id, productData);
        // Lấy lại sản phẩm sau khi cập nhật
        product = await getProductId(id);
        // Kiểm tra xem sản phẩm có tồn tại không
        const data = { get_layout, product, formatDate, listProductCat, product_cat };
        res.render("edit_product", data); // Render trang chỉnh sửa
    } catch (error) {
        console.error(error);
        res.status(500).send("Lỗi khi cập nhật sản phẩm!");
    }
};

// Xóa sản phẩm
exports.delete_product = async (req, res) => {
    try {
        const id = req.params.id;
        // Lấy thông tin sản phẩm trước khi xóa
        const product = await getProductId(id);
        if (!product) {
            return res.status(404).send("Sản phẩm không tồn tại!");
        }
        deleteOldImages(product); // Xóa ảnh cũ
        await deletedProduct(id);
        res.redirect("/sanpham"); // Chuyển hướng về danh sách sản phẩm
    } catch (error) {
        console.error(error);
        res.status(500).send("Lỗi khi xóa sản phẩm!");
    }
}


// ========= add========
//  Cách thực hiện
// Lấy dữ liệu từ req.body do người dùng nhập vào form.
// Tạo một document mới trong MongoDB dựa trên model Product.
// Lưu sản phẩm vào database và xử lý lỗi nếu có.
// Hiển thị thông báo khi thêm thành công hoặc thất bại.