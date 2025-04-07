require("module-alias/register");
require("dotenv").config(); // Load biến môi trường từ .env
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
// Định nghĩa biến toàn cục cho EJS
const app = express();
const port = process.env.PORT || 8000;

// =============== Lib ==============
const moduleViews = require("@lib/views"); // Import module views
const route = require("@lib/routes"); // Tự động load tất cả modules
const connectDB = require("@config/database");
// const autoLoad = require("@config/autoload"); 
// autoLoad(app);
const load_featured_products = require("./src/middleware/featured_products");
app.use(load_featured_products); // Áp dụng middleware
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
app.set("views", [path.join(__dirname, "views"), ...moduleViews]);
app.locals.BASE_URL = process.env.BASE_URL;
// Routes
app.use("/", route);
app.get("/", (req, res) => {
    res.redirect("/trang-chu");
});
app.listen(port, () => {
    console.log(`Ket noi thanh cong ${port}`);
})



