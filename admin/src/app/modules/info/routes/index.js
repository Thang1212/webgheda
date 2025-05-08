const express = require("express");
const router = express.Router();
const InfoController = require("../controllers/InfoController");

router.get("/", InfoController.index);
router.put("/user/:id", InfoController.updateUserInfo);
router.delete("/user/:id", InfoController.destroyUserInfo);
router.put("/admin/:id", InfoController.updateAdminInfo);
router.delete("/admin/:id", InfoController.destroyAdminInfo);
router.get("/admin", InfoController.list_admin);
router.get("/user", InfoController.list_user);

module.exports = {
    //url mặt đinh là http://localhost:5000/info-user
    path: "/info-user",  //  Module mới có đường dẫn riêng
    router,
};