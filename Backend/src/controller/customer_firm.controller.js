const customerFirmModel = require("../models/customer_firm.model");
const userModel = require("../models/user.model");

async function createCustomerFirm(req, res) {
  try {
    // 1. Initial Body Check
    if (!req.body || Object.keys(req.body).length === 0) {
      return res
        .status(400)
        .json({ status: false, message: "No data provided" });
    }

    let { id, customer_id, firm_name, firm_type, gst_number, pan_number } =
      req.body;
    const numericId = Number(id);
    let errors = [];

    // 2. Strict ID Validation (Mandatory for both Create and Update)
    if (id === undefined || id === null || isNaN(numericId)) {
      errors.push("The id field is required (use 0 for new records)");
    }

    // 3. Conditional Validation for Create (id === 0)
    // If updating, these are only required if you want to force them to be present
    if (numericId === 0) {
      if (!customer_id) errors.push("The customer_id field is required");
      if (!firm_name || String(firm_name).trim() === "")
        errors.push("The firm_name is required");
      if (!firm_type) errors.push("The firm_type is required");
    }

    if (errors.length > 0) {
      return res
        .status(400)
        .json({ status: false, message: errors.join(", ") });
    }

    // 4. Build Dynamic Update Object (Crucial Loophole Fix)
    // We only add fields to 'updateData' if they are sent in req.body
    let updateData = {};

    if (customer_id !== undefined) updateData.customer_id = Number(customer_id);
    if (firm_name !== undefined) updateData.firm_name = firm_name.trim();
    if (firm_type !== undefined) updateData.firm_type = firm_type.trim();

    // Normalize GST/PAN if provided
    const gst = gst_number ? gst_number.toUpperCase().trim() : null;
    const pan = pan_number ? pan_number.toUpperCase().trim() : null;

    if (gst !== null) updateData.gst_number = gst;
    if (pan !== null) updateData.pan_number = pan;

    // 5. Check for GST/PAN Uniqueness (Only if being changed/added)
    if (gst || pan) {
      let uniqueQuery = [];
      if (gst) uniqueQuery.push({ gst_number: gst });
      if (pan) uniqueQuery.push({ pan_number: pan });

      const existingFirm = await customerFirmModel.findOne({
        $or: uniqueQuery,
        id: { $ne: numericId },
        status: 1,
      });

      if (existingFirm) {
        const field =
          existingFirm.gst_number === gst ? "GST Number" : "PAN Number";
        return res.status(400).json({
          status: false,
          message: `This ${field} is already registered to another firm.`,
        });
      }
    }

    // 6. Execution Branch
    if (numericId === 0) {
      // --- CREATE ---
      // Check if customer exists before creating a firm for them
      const customer = await userModel.findOne({
        id: updateData.customer_id,
        status: 1,
      });
      if (!customer) {
        return res
          .status(404)
          .json({ status: false, message: "Customer not found or inactive" });
      }

      const lastFirm = await customerFirmModel.findOne().sort({ id: -1 });
      const nextId = lastFirm ? lastFirm.id + 1 : 1;

      const newFirm = await customerFirmModel.create({
        ...updateData,
        id: nextId,
        status: 1,
      });

      return res
        .status(201)
        .json({ status: true, message: "Firm created", data: newFirm });
    } else {
      // --- UPDATE ---
      // findOneAndUpdate with $set only changes the fields present in updateData
      const updatedFirm = await customerFirmModel.findOneAndUpdate(
        { id: numericId, status: 1 },
        { $set: updateData },
        { new: true, runValidators: true },
      );

      if (!updatedFirm) {
        return res
          .status(404)
          .json({ status: false, message: "Firm record not found" });
      }

      return res
        .status(200)
        .json({ status: true, message: "Firm updated", data: updatedFirm });
    }
  } catch (err) {
    // Catch Database-level unique constraint violations (Race conditions)
    if (err.code === 11000) {
      return res.status(400).json({
        status: false,
        message: "System detected a duplicate GST or PAN.",
      });
    }
    console.error("Critical Error:", err);
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
  }
}

async function getCustomerFirms(req, res) {
  try {
    // 1. Extract optional filters from the request body
    const { customer_id, firm_type } = req.body || {};

    // 2. Initialize the filter with 'status: 1' to only fetch active records
    let filter = { status: 1 };

    // 3. Loophole Fix: Dynamically add filters only if they are provided and valid
    if (
      customer_id !== undefined &&
      customer_id !== null &&
      customer_id !== ""
    ) {
      filter.customer_id = Number(customer_id);
    }

    if (firm_type && typeof firm_type === "string" && firm_type.trim() !== "") {
      filter.firm_type = firm_type.trim();
    }

    // 4. Fetch data from MongoDB
    // .lean() is used for better performance as it returns plain JS objects
    const firms = await customerFirmModel
      .find(filter)
      .select("-__v") // Exclude internal versioning field
      .sort({ id: 1 }) // Show newest records first
      .lean();

    // 5. Response
    return res.status(200).json({
      status: true,
      message:
        firms.length > 0 ? "Data fetched successfully" : "No records found",
      total_count: firms.length,
      data: firms,
    });
  } catch (err) {
    console.error("Get Firms Error:", err);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
      detail: err.message,
    });
  }
}

async function deleteCustomerFirm(req, res) {
  try {
    let { id } = req.body || {};
    const numericId = Number(id);
    if (id === undefined || isNaN(Number(id))) {
      return res
        .status(400)
        .json({ status: false, message: "Valid id is required" });
    }
    const deletedFirm = await customerFirmModel.findOneAndUpdate(
      { id: numericId, status: 1 },
      { status: -1 },
      { new: true },
    );
    if (!deletedFirm) {
      return res
        .status(404)
        .json({ status: false, message: "Firm record not found" });
    }
    return res.status(200).json({
      status: true,
      message: "Firm deleted successfully",
    });
  } catch (err) {
    console.error("Delete Firm Error:", err);
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
  }
}

module.exports = { createCustomerFirm, getCustomerFirms, deleteCustomerFirm };
