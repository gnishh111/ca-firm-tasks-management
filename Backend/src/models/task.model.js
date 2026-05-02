const mongoose = require("mongoose");
const moment = require("moment-timezone");

const taskSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    customer_id: {
      type: Number,
      required: true,
      index: true,
    },
    firm_id: {
      type: Number,
      required: true,
      index: true,
    },
    service_id: {
      type: Number,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    priority: {
      type: String,
      enum: ["High", "Medium", "Low", "Urgent"],
      default: "Medium",
    },
    task_status: {
      type: String,
      enum: ["Pending", "Running", "Completed", "Hold"],
      default: "Pending",
    },
    created_by: {
      type: Number,
      required: true,
    },
    manager_id: {
      type: Number,
      default: 0,
    },
    // Date Objects for logic calculations (next/last run)
    next_run_date: {
      type: Date,
      default: null,
    },
    last_run_date: {
      type: Date,
      default: null,
    },
    due_date: {
      type: Date,
      default: null,
    },
    task_period: {
      type: String,
      enum: ["One-Time", "Daily", "Weekly", "Monthly", "Quarterly", "Yearly"],
      default: "One-Time",
    },
    status: {
      type: Number,
      default: 1, // 1 for Active, -1 for Deleted
    },
    // Manual IST String timestamps matching customerFirmModel
    created_at: { type: String },
    updated_at: { type: String },
  },
  {
    timestamps: false,
    versionKey: false,
  },
);

// --- IST TIME CONVERSION HELPER ---
const getISTString = () =>
  moment.tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

// --- MIDDLEWARE (Matching your custom style) ---
taskSchema.pre("save", function () {
  const indiaTime = getISTString();
  this.updated_at = indiaTime;
  if (this.isNew) {
    this.created_at = indiaTime;
  }
});

taskSchema.pre("findOneAndUpdate", function () {
  this.set({ updated_at: getISTString() });
});

// Adding an index for common search queries
taskSchema.index({ firm_id: 1, service_id: 1, due_date: 1 });

const taskModel = mongoose.model("tasks", taskSchema);

module.exports = taskModel;
