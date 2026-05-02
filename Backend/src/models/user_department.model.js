const mongoose = require("mongoose");
const moment = require("moment-timezone");

const userDeptSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    user_id: {
      type: Number,
      required: true,
    },
    department_id: {
      type: Number,
      required: true,
    },
    status: {
      type: Number,
      default: 1, // 1 for active mapping, -1 for removed
    },
    created_at: { type: String },
    updated_at: { type: String },
  },
  {
    timestamps: false,
    versionKey: false,
  },
);

// Helper function for IST String
const getISTString = () =>
  moment.tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

// --- MIDDLEWARE FOR SAVING (Removed 'next') ---
userDeptSchema.pre("save", function () {
  const indiaTime = getISTString();
  this.updated_at = indiaTime;
  if (this.isNew) {
    this.created_at = indiaTime;
  }
});

// --- MIDDLEWARE FOR UPDATING ---
userDeptSchema.pre("findOneAndUpdate", function () {
  this.set({ updated_at: getISTString() });
});

const userDeptModel = mongoose.model("user_department", userDeptSchema);

module.exports = userDeptModel;
