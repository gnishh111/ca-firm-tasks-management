const mongoose = require("mongoose");
const moment = require("moment-timezone");

const customerFirmSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    customer_id: {
      type: Number,
      required: true,
    },
    firm_name: {
      type: String,
      required: true,
      trim: true,
    },
    firm_type: {
      type: String,
      required: true, // proprietorship, partnership, pvt ltd etc.
      trim: true,
    },
    gst_number: {
      type: String,
      default: "",
      trim: true,
    },
    pan_number: {
      type: String,
      default: "",
      trim: true,
    },
    status: {
      type: Number,
      default: 1,
    },
    created_at: { type: String },
    updated_at: { type: String },
  },
  {
    timestamps: false,
    versionKey: false,
  },
);

const getISTString = () =>
  moment.tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

// --- MIDDLEWARE (No 'next' function to avoid crash) ---
customerFirmSchema.pre("save", function () {
  const indiaTime = getISTString();
  this.updated_at = indiaTime;
  if (this.isNew) {
    this.created_at = indiaTime;
  }
});

customerFirmSchema.pre("findOneAndUpdate", function () {
  this.set({ updated_at: getISTString() });
});

const customerFirmModel = mongoose.model("customer_firm", customerFirmSchema);

module.exports = customerFirmModel;
