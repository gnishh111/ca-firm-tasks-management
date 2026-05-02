const mongoose = require("mongoose");
const moment = require("moment-timezone");

const departmentSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    manager_id: {
      type: Number,
      default: 0,
    },
    status: {
      type: Number,
      default: 1, // 1: Active, 0: Inactive, -1: Deleted
    },
    created_at: { type: String },
    updated_at: { type: String },
  },
  {
    timestamps: false,
    toJSON: { getters: true },
    toObject: { getters: true },
  },
);

// Helper function for IST String
const getISTString = () =>
  moment.tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

// --- MIDDLEWARE FOR SAVING ---
departmentSchema.pre("save", function () {
  const indiaTime = getISTString();
  this.updated_at = indiaTime;
  if (this.isNew) {
    this.created_at = indiaTime;
  }
});

// --- MIDDLEWARE FOR UPDATING ---
departmentSchema.pre("findOneAndUpdate", function () {
  this.set({ updated_at: getISTString() });
});

const departmentModel = mongoose.model("department", departmentSchema);

module.exports = departmentModel;
