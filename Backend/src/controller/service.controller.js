const serviceModel = require("../models/service.model");

async function createService(req, res) {
  // DEBUG LOG: Check terminal to see what is arriving
  console.log("Request Body:", req.body);

  try {
    let { id, name, type, is_recurring, recurrence_type, base_price } =
      req.body || {};

    // PRODUCTION-READY ID PARSING:
    // This handles strings "0", numbers 0, and null/undefined safely
    let numericId;
    if (id === "0" || id === 0) {
      numericId = 0;
    } else {
      numericId = id ? Number(id) : NaN;
    }

    let errors = [];

    // 2. ID Validation - Only error if it's truly not a number
    if (isNaN(numericId)) {
      errors.push("The id field is required (use 0 for new records)");
    }

    // 3. Conditional Validation for Create
    if (numericId === 0) {
      if (!name || String(name).trim() === "")
        errors.push("The service name is required");
      if (!type) errors.push("The service type is required");

      // Price Check: Allows 0, but rejects empty/NaN
      const price = Number(base_price);
      if (base_price === undefined || base_price === "" || isNaN(price)) {
        errors.push("The base_price is required and must be a number");
      }
    }

    if (errors.length > 0) {
      return res
        .status(400)
        .json({ status: false, message: errors.join(", ") });
    }

    // 4. Build Dynamic Update Object (Don't change data if user didn't send it)
    let updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (type !== undefined) updateData.type = type.trim().toUpperCase();
    if (is_recurring !== undefined)
      updateData.is_recurring = Number(is_recurring);
    if (recurrence_type !== undefined)
      updateData.recurrence_type = recurrence_type.trim();
    if (base_price !== undefined) updateData.base_price = Number(base_price);

    // 5. Unique Service Name Check
    if (updateData.name) {
      const existingName = await serviceModel.findOne({
        name: updateData.name,
        id: { $ne: numericId },
        status: 1,
      });
      if (existingName) {
        return res
          .status(400)
          .json({
            status: false,
            message: "A service with this name already exists",
          });
      }
    }

    // 6. Execution Branch
    if (numericId === 0) {
      const lastService = await serviceModel.findOne().sort({ id: -1 });
      const nextId = lastService ? lastService.id + 1 : 1;

      const newService = await serviceModel.create({
        ...updateData,
        id: nextId,
        status: 1,
      });

      return res
        .status(201)
        .json({
          status: true,
          message: "Service created successfully",
          data: newService,
        });
    } else {
      const updatedService = await serviceModel.findOneAndUpdate(
        { id: numericId, status: 1 },
        { $set: updateData },
        { new: true, runValidators: true },
      );

      if (!updatedService) {
        return res
          .status(404)
          .json({ status: false, message: "Service not found or inactive" });
      }

      return res
        .status(200)
        .json({
          status: true,
          message: "Service updated successfully",
          data: updatedService,
        });
    }
  } catch (err) {
    if (err.name === "ValidationError") {
      return res
        .status(400)
        .json({
          status: false,
          message: "Validation Error",
          detail: err.message,
        });
    }
    console.error("Service Controller Error:", err);
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
  }
}

async function getService(req, res) {
  try {
    const { id, type } = req.body || {};

    // 1. Build Dynamic Filter
    // Always start with status: 1 to show only active records
    let filter = { status: 1 };

    // If ID is provided, add it to filter
    if (id !== undefined && id !== null && id !== "") {
      filter.id = Number(id);
    }

    // If Type is provided, add it to filter (normalized to uppercase)
    if (type && String(type).trim() !== "") {
      filter.type = String(type).trim().toUpperCase();
    }

    // 2. Execute Query
    // .lean() makes the query faster for read-only data
    const services = await serviceModel
      .find(filter)
      .select("-__v")
      .sort({ id: 1 })
      .lean();

    // 3. Response
    return res.status(200).json({
      status: true,
      message:
        services.length > 0 ? "Data fetched successfully" : "No records found",
      total_count: services.length,
      data: services,
    });
  } catch (err) {
    console.error("Get Service Error:", err);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
}

async function deleteService(req, res) {
  try {
    const { id } = req.body || {};
    const numericId = Number(id);

    // 1. Validation: Ensure a valid ID is provided
    if (
      id === undefined ||
      id === null ||
      isNaN(numericId) ||
      numericId === 0
    ) {
      return res.status(400).json({
        status: false,
        message: "A valid Service ID is required for deletion.",
      });
    }

    // 2. Execution: Soft Delete (Update status to -1)
    const deletedService = await serviceModel.findOneAndUpdate(
      { id: numericId, status: 1 }, // Only delete if currently active
      { $set: { status: -1 } }, // Mark as deleted
      { new: true },
    );

    // 3. Check if service existed
    if (!deletedService) {
      return res.status(404).json({
        status: false,
        message: "Service not found or already deleted.",
      });
    }

    // 4. Success Response
    return res.status(200).json({
      status: true,
      message: "Service deleted successfully.",
    });
  } catch (err) {
    console.error("Delete Service Error:", err);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
}

module.exports = { createService, getService , deleteService};