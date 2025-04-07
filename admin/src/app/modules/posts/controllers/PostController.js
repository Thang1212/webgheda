const Post = require("../models/tbl_post");
const { deleteOldImage } = require("../models/PostModel");
const { formatDate } = require("@helper/format"); // Import helper
const { get_layout } = require("@helper/template");
const { mongooseToObject } = require('../utils/mongoose');


// [POST] /bai-viet
exports.list_post = async (req, res, next) => {
    const perPage = 6; // Số bài viết trên mỗi trang
    const page = parseInt(req.params.id) || 1; // Lấy số trang từ query hoặc mặc định là trang 1
    const totalPosts = await Post.countDocuments(); // Đếm tổng số bài viết
    const status_vn = {
        draft: "Bản nháp",
        published: "Đã đăng",
        pending: "Chờ duyệt",
        archived: "Đã lưu trữ",
    };
    try {
        // Lấy danh sách bài viết theo trang, có phân trang và liên kết với admin
        const posts = await Post.find()
            .populate("admin_id", "username") // Lấy username của admin
            .skip((page - 1) * perPage)
            .limit(perPage);
        // Chuyển đổi trạng thái bài viết sang tiếng Việt
        posts.forEach(post => {
            post.post_status = status_vn[post.post_status] || "Không xác định";
        });

        // Chuẩn bị dữ liệu truyền vào view
        const data = {
            get_layout,
            posts: mongooseToObject(posts), // Chuyển đổi Mongoose object
            formatDate,
            currentPage: page,
            totalPages: Math.ceil(totalPosts / perPage), // Tổng số trang
            stt_post: (page - 1) * perPage, // STT bài viết trên trang
        };
        res.render("list_post", data);
    } catch (error) {
        console.error(error);
        res.status(500).send("Lỗi server!");
    }
};

// [DELETE] /bai-viet/:id
exports.destroy_post = async (req, res) => {
    try {
        // Tìm bài viết cần xóa
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Không tìm thấy bài viết' });
        }
        // console.log(post);
        // Xóa ảnh cũ liên quan đến bài viết
        deleteOldImage(post); // Xóa ảnh cũ trước khi xóa bài viết

        // Xóa bài viết
        await Post.findByIdAndDelete(req.params.id);

        // Chuyển hướng về trang danh sách bài viết
        res.redirect('/bai-viet');
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi xóa bài viết', error });
    }
};

// [GET] /bai-viet/edit/:id
exports.edit_post = async (req, res, next) => {
    Post.findById(req.params.id).populate('admin_id', 'username')
        .then((post) =>
            res.render('edit_post', {
                get_layout,
                formatDate,
                post: mongooseToObject(post),
            }),
        )
        .catch(next);
};

// [PUT] /bai-viet/:id

exports.update_post = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { post_title, post_slug, post_excerpt, post_content, post_status } = req.body;
        const newImagePath = req.file ? `/images/uploads/${req.file.filename}` : null;

        let post = await Post.findById(id);
        if (!post) {
            return res.status(404).send("Bài viết không tồn tại!");
        }
        if (newImagePath) {
            deleteOldImage(post);
        }

        await Post.updateOne(
            { _id: id },
            {
                post_title,
                post_slug,
                post_excerpt,
                post_content,
                post_status,
                post_image: newImagePath || post.post_image,
            }
        );

        post = await Post.findById(id).populate("admin_id", "username");

        res.render("edit_post", {
            get_layout,
            formatDate,
            post: mongooseToObject(post),
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Lỗi khi cập nhật bài viết!");
    }
};

// [GET] /bai-viet/add
exports.add_post = async (req, res) => {
    res.render("add_post", { get_layout });
};


exports.create_post = async (req, res) => {
    try {
        // Lấy bài viết cuối cùng để tính ID mới
        const { post_title, post_slug, post_excerpt, post_content, post_status } = req.body;
        // Kiểm tra nếu thiếu thông tin
        if (!post_title || !post_slug || !post_content) {
            return res.status(400).json({
                message: 'Vui lòng nhập đầy đủ thông tin!',
                errors: {
                    post_title: !post_title ? 'Tiêu đề không được để trống' : null,
                    post_slug: !post_slug ? 'Slug không được để trống' : null,
                    post_content: !post_content ? 'Nội dung không được để trống' : null
                }
            });
        }
        // Lưu đường dẫn ảnh đại diện (chỉ lấy ảnh đầu tiên)
        const post_image = req.files && req.files.length > 0 ? `/images/uploads/${req.files[0].filename}` : null;
        // Tạo bài viết mới
        await Post.create({
            post_title,
            post_slug,
            post_excerpt,
            post_content,
            post_status,
            post_image, // ✅ Lưu ảnh
            admin_id: req.session.user.id, // ✅ Lưu ObjectId của admin
        });
        // res.json(post_image);
        res.redirect('/bai-viet');
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating post', error });
    }
};