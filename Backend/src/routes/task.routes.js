const express = require("express");
const multer = require("multer");
const { createTask, getTask, deleteTask } = require("../controller/task.controller");

const route = express.Router();

const upload = multer();

route.post("/create-task", upload.none(), createTask);

route.post("/get-task", upload.none(), getTask);

route.post("/delete-task", upload.none(), deleteTask);

module.exports = route;