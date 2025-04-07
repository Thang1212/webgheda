require("module-alias/register");
require("dotenv").config(); // Load biến môi trường từ .env
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const methodOverride = require('method-override')
const path = require("path");
// Định nghĩa biến toàn cục cho EJS
const app = express();
const port = process.env.PORT || 8000;

const session = require("express-session");
const userMiddleware = require("@middleware/userMiddleware");
const authMiddleware = require("@middleware/authMiddleware");


app.use(session({
    secret: process.env.SCRET_SESSION_KEY || "4a3f1e98c9a0b2e4d2fabcde67589fdc2e3a7b9c5d4e3f1a9b2c4d6e8f0a1b3c", // Chuỗi bí mật để mã hóa session
    resave: false, 
    saveUninitialized: true,  // Phải để `false` để tránh session rỗng
    cookie: { secure: false } // Chỉnh `true` nếu dùng HTTPS
}));


const moduleViews = require("@lib/views"); // Import module views
const route = require("@lib/routes"); // Tự động load tất cả modules
const connectDB = require("@config/database"); // Import MongoDB connection

// Kết nối MongoDB
connectDB();
// Middleware
app.use(cors()); // Cho phép gọi API từ frontend
app.use(express.urlencoded({ extended: true })); // Giúp đọc dữ liệu từ form
app.use(express.json()); // Giúp đọc JSON từ request body
app.use(morgan("dev")); // Log request để dễ debug
app.use(express.static('./src/public'))

// View Engine
app.set("view engine", "ejs");
// thiết lập mặt định
app.set("views", [path.join(__dirname, "views"), ...moduleViews]);
app.locals.BASE_URL = process.env.BASE_URL;


// Sử dụng middleware để thêm user vào res.locals
app.use(userMiddleware); // Gán user vào res.locals trước
app.use(authMiddleware); // Kiểm tra đăng nhập


// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))


// Routes
app.use("/", route);
app.get("/", (req, res) => {
    res.redirect("/trang");
});



app.listen(port, () => {
    console.log(`Ket noi thanh cong ${port}`);
})



