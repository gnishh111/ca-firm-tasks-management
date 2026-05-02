const express = require('express');
const multer = require('multer');
const { createFirmService, getFirmService, deleteFirmService } = require('../controller/firm_service.controller');

const route = express.Router();

const upload = multer();

route.post("/create-firm-service", upload.none(), createFirmService);

route.post("/get-firm-service", upload.none(), getFirmService);

route.post("/delete-firm-service", upload.none(), deleteFirmService);

module.exports = route;