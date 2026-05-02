const mongoose = require("mongoose");
const moment = require("moment-timezone");

const userSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    profile_pic: { type: String, default: "" },
    role: {
      type: String,
      enum: ["admin", "customer", "employee"],
      required: true,
    },
    is_manager: { type: Number, default: 0 },
    token: { type: String, default: "" },
    status: { type: Number, default: 1 },
    created_at: { type: String },
    updated_at: { type: String },
  },
  { timestamps: false },
);

const getISTString = () =>
  moment.tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

// Fixed: Removed 'next' to prevent crash during userModel.create()
userSchema.pre("save", function () {
  const indiaTime = getISTString();
  this.updated_at = indiaTime;
  if (this.isNew) {
    this.created_at = indiaTime;
  }
});

// Fixed: Removed 'next' to prevent crash during findOneAndUpdate()
userSchema.pre("findOneAndUpdate", function () {
  this.set({ updated_at: getISTString() });
});

module.exports = mongoose.model("user", userSchema);
