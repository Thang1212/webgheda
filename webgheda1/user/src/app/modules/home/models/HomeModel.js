const tbl_product = require("./tbl_product");

// const getProducts = async () => {
//     return await tbl_product.find({ product_status: "active" });
// }

const countProduct = async () => {
    return await tbl_product.countDocuments();
}

const getProductsPaging = async (page = 1, perPage = 10) => {
    return await tbl_product
        .find({ product_status: "active" })
        .skip((page - 1) * perPage)
        .limit(perPage);
};
const data = {  getProductsPaging ,countProduct };

// Export các hàm để sử dụng ở file khác
module.exports = data;