const express = require("express");
const multer = require("multer");
const {
  createCustomerFirm,
  getCustomerFirms,
  deleteCustomerFirm,
} = require("../controller/customer_firm.controller");

const route = express.Router();
const upload = multer();

route.post("/create-customer-firm", upload.none(), createCustomerFirm);

route.post("/get-customer-firm", upload.none(), getCustomerFirms);

route.post("/delete-customer-firm", upload.none(), deleteCustomerFirm);

module.exports = route;
