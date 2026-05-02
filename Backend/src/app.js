const express = require('express');
const cors = require('cors');
const connectDB = require('./db/db');
const userRoutes = require('./routes/user.routes');
const departmentRoutes = require('./routes/department.routes');
const userDepartmentRoutes = require('./routes/user_department.routes');
const customerFirm = require('./routes/customer_firm.routes');
const serviceRoutes = require('./routes/service.routes');
const firmServiceRoutes = require('./routes/firm_service.routes');
const taskRoutes = require('./routes/task.routes');
const path = require('path');

const app = express();

connectDB();

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.use(express.json()); // This fixes the 'undefined req.body' error for JSON requests
app.use(express.urlencoded({ extended: true })); // This fixes it for URL-encoded requests

app.use("/images", express.static(path.join(__dirname, "public/images")));

app.use(
  "/api",
  userRoutes,
  departmentRoutes,
  userDepartmentRoutes,
  customerFirm,
  serviceRoutes,
  firmServiceRoutes,
  taskRoutes 
);

module.exports = app;