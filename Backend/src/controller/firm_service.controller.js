const firmServiceModel = require("../models/firm_service.model");
const customerFirmModel = require("../models/customer_firm.model");
const serviceModel = require("../models/service.model");
const moment = require("moment-timezone");

const formatDateOnly = (date) => {
  if (!date) return null;
  return moment(date).format("YYYY-MM-DD");
};

async function createFirmService(req, res) {
  try {
    let { id, firm_id, service_id, service_price, start_date, end_date } =
      req.body || {};
    const numericId = Number(id);

    // 1. Validation Logic
    if (isNaN(numericId))
      return res
        .status(400)
        .json({ status: false, message: "Valid ID required" });

    // 2. Prepare Data & Normalize Time to UTC Midnight
    let updateData = { status: 1 };
    if (firm_id) updateData.firm_id = Number(firm_id);
    if (service_id) updateData.service_id = Number(service_id);
    if (service_price !== undefined)
      updateData.service_price = Number(service_price);

    if (start_date) {
      let d = new Date(start_date);
      d.setUTCHours(0, 0, 0, 0);
      updateData.start_date = d;
    }
    if (end_date) {
      let d = new Date(end_date);
      d.setUTCHours(0, 0, 0, 0);
      updateData.end_date = d;
    }

    // 3. Execution (Create vs Update)
    if (numericId === 0) {
      const last = await firmServiceModel.findOne().sort({ id: -1 }).lean();
      updateData.id = (last?.id || 0) + 1;
      const result = await firmServiceModel.create(updateData);
      return res
        .status(201)
        .json({ status: true, message: "Created", data: result });
    } else {
      const result = await firmServiceModel
        .findOneAndUpdate(
          { id: numericId, status: 1 },
          { $set: updateData },
          { new: true },
        )
        .lean();
      return res
        .status(200)
        .json({ status: true, message: "Updated", data: result });
    }
  } catch (err) {
    return res.status(500).json({ status: false, message: err.message });
  }
}

async function getFirmService(req, res) {
  try {
    const { firm_id, service_id, start_date, end_date } = req.body || {};

    const query = { status: 1 };

    // ---- BASIC FILTERS ----
    if (firm_id) query.firm_id = Number(firm_id);
    if (service_id) query.service_id = Number(service_id);

    // ---- DATE FILTERS ----
    if (start_date) {
      const start = moment
        .tz(start_date, "Asia/Kolkata")
        .startOf("day")
        .toDate();

      query.start_date = { $gte: start };
    }

    if (end_date) {
      const end = moment.tz(end_date, "Asia/Kolkata").endOf("day").toDate();

      query.end_date = { $lte: end };
    }

    const data = await firmServiceModel
      .find(query)
      .sort({ id: 1 })
      .lean();

    const formatted = data.map((item) => ({
      ...item,
      start_date: formatDateOnly(item.start_date),
      end_date: formatDateOnly(item.end_date),
    }));

    return res.status(200).json({
      status: true,
      total_count: formatted.length,
      data: formatted,
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: err.message,
    });
  }
}

async function deleteFirmService(req, res) {
  try {
    // 1. Extract and validate ID
    let { id } = req.body || {};
    const numericId = Number(id);

    if (isNaN(numericId) || numericId <= 0) {
      return res.status(400).json({
        status: false,
        message: "A valid numeric ID is required for deletion",
      });
    }

    // 2. Perform Soft Delete
    // We only look for status: 1 to ensure we don't "delete" something already deleted
    const result = await firmServiceModel
      .findOneAndUpdate(
        { id: numericId, status: 1 },
        { $set: { status: -1 } }, // -1 indicates soft-deleted
        { new: true },
      )
      .lean();

    // 3. Check if record was found
    if (!result) {
      return res.status(404).json({
        status: false,
        message: "Record not found or already deleted",
      });
    }

    // 4. Success Response
    return res.status(200).json({
      status: true,
      message: "Service mapping deleted successfully",
      deleted_id: numericId,
    });
  } catch (err) {
    console.error("Delete Error:", err);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
}

module.exports = { createFirmService, getFirmService, deleteFirmService };
