const express = require("express");
// const multer = require("multer");
const { uploadFile } = require("../helper/fileUpload");
const {
  createUserController,
  loginUserController,
  getUserController,
  deleteUserController,
} = require("../controller/user.controller");

const route = express.Router();

const upload = uploadFile("images/User");

route.post("/create-user", upload.single("profile_pic"), createUserController);

route.post("/login-user", upload.none(), loginUserController);

route.post("/get-user", upload.none(), getUserController);

route.post("/delete-user", upload.none(), deleteUserController);

module.exports = route;
