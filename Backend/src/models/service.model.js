const mongoose = require("mongoose");
const moment = require("moment-timezone");

const serviceSchema = new mongoose.Schema(
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
    type: {
      type: String,
      required: true,
      trim: true,
      uppercase: true, // Automatically converts input to uppercase
      enum: {
        values: [
          "ACCOUNTING",
          "AUDIT",
          "INCOME TAX RETURN FILING",
          "TDS/TCS RETURN FILING",
          "GST RETURN FILING",
          "GST SCRUTINY",
          "INCOME TAX SCRUTINY",
          "REGISTRATION",
          "APPLICATIONS",
          "CERTIFICATES",
          "CMA DATA",
          "INCOME TAX VERIFICATION",
          "INCORPORATION",
          "OTHERS",
          "CONSULTANCY CHARGES",
        ],
        message: "{VALUE} is not a supported service type",
      },
    },
    is_recurring: {
      type: Number, // 1: Yes, 0: No
      default: 0,
    },
    recurrence_type: {
      type: String, // e.g., "Monthly", "Quarterly", "Annually"
      default: "",
      uppercase: true,
    },
    base_price: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: Number,
      default: 1, // 1: Active, -1: Deleted
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

// --- MIDDLEWARE FOR SAVING ---
serviceSchema.pre("save", function () {
  const indiaTime = getISTString();
  this.updated_at = indiaTime;
  if (this.isNew) {
    this.created_at = indiaTime;
  }
});

// --- MIDDLEWARE FOR UPDATING ---
serviceSchema.pre("findOneAndUpdate", function () {
  this.set({ updated_at: getISTString() });
});

const serviceModel = mongoose.model("service", serviceSchema);

module.exports = serviceModel;
