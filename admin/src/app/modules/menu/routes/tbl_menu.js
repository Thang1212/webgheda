const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
    name: String, // Tên menu (ví dụ: "Main Menu", "Footer Menu")
    position: String, // Vị trí menu (header, footer, sidebar)
    items: [
        {
            title: String, // Tên mục menu
            url: String // Liên kết
        }
    ]
});

const Menu = mongoose.model("Menu", menuSchema);
module.exports = Menu;
