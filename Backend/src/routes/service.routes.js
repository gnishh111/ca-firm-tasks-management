const express = require('express');
const multer = require('multer');
const { createService, getService, deleteService } = require('../controller/service.controller');

const route = express.Router();

const upload = multer();

route.post("/create-service", upload.none(), createService);

route.post("/get-service", upload.none(), getService);

route.post("/delete-service", upload.none(), deleteService);

module.exports = route;