const mongoose = require("mongoose");
const moment = require("moment-timezone");

const firmServiceSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    firm_id: {
      type: Number,
      required: true,
    },
    service_id: {
      type: Number,
      required: true,
    },
    service_price: {
      type: Number,
      required: true,
      default: 0,
    },
    start_date: {
      type: Date,
      required: true,
    },
    end_date: {
      type: Date,
      required: true,
    },
    status: {
      type: Number,
      default: 1, // 1: Active, 0: Expired, -1: Deleted
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

// --- MIDDLEWARES ---
firmServiceSchema.pre("save", function () {
  const indiaTime = getISTString();
  this.updated_at = indiaTime;
  if (this.isNew) {
    this.created_at = indiaTime;
  }
});

firmServiceSchema.pre("findOneAndUpdate", function () {
  this.set({ updated_at: getISTString() });
});

const firmServiceModel = mongoose.model("firm_service", firmServiceSchema);

module.exports = firmServiceModel;
