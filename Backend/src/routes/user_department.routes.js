const express = require('express');
const multer = require('multer');
const { createUserDepartmentController, getUserDepartmentController,deleteUserDepartmentController } = require('../controller/user_department.controller');

const route = express.Router();

const upload = multer();

route.post("/create-user-department", upload.none(), createUserDepartmentController);

route.post("/get-user-department", upload.none(), getUserDepartmentController);

route.post("/delete-user-department", upload.none(), deleteUserDepartmentController);

module.exports = route;