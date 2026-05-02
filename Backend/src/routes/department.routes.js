const express = require("express");
const multer = require("multer");
const {
  createDepartmentController,
  getDepartmentController,
  deleteDepartmentController,
} = require("../controller/department.controller");

const route = express.Router();

const upload = multer();

route.post("/create-department", upload.none(), createDepartmentController);

route.post("/get-department", upload.none(), getDepartmentController);

route.post("/delete-department", upload.none(), deleteDepartmentController);


module.exports = route;
