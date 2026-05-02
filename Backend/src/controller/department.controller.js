const departmentModel = require("../models/department.model");
const userModel = require("../models/user.model");

async function createDepartmentController(req, res) {
  try {
    let { id, name, manager_id } = req.body || {};
    const numericId = Number(id);
    let errors = [];

    // 1. Basic Validation
    if (id === undefined || id === null || isNaN(numericId))
      errors.push("The id field is required");
    if (!name || name.trim() === "")
      errors.push("The department name is required");

    if (errors.length > 0) {
      return res
        .status(400)
        .json({ status: false, message: errors.join(", ") });
    }

    const trimmedName = name.trim();

    // --- NEW FIX: UNIQUE NAME VALIDATION ---
    // Check if another active department already has this name
    const existingName = await departmentModel
      .findOne({
        name: { $regex: new RegExp(`^${trimmedName}$`, "i") }, // Case-insensitive check
        status: 1,
        id: { $ne: numericId }, // Important: exclude current department during update
      })
      .lean();

    if (existingName) {
      return res.status(400).json({
        status: false,
        message: `Department with name '${trimmedName}' already exists`,
      });
    }

    // Capture the OLD manager before updating (needed for demotion logic)
    let oldManagerId = 0;
    if (numericId !== 0) {
      const existingDept = await departmentModel
        .findOne({ id: numericId, status: 1 })
        .lean();
      if (existingDept) oldManagerId = existingDept.manager_id;
    }

    let finalManagerId =
      manager_id !== undefined
        ? Number(manager_id)
        : numericId === 0
          ? 0
          : undefined;

    // 2. NEW MANAGER PROMOTION LOGIC
    if (finalManagerId && finalManagerId > 0) {
      const user = await userModel.findOne({ id: finalManagerId, status: 1 });
      if (!user)
        return res.status(404).json({
          status: false,
          message: "User not found to assign as manager",
        });

      if (user.is_manager === 0) {
        await userModel.findOneAndUpdate(
          { id: finalManagerId },
          { $set: { is_manager: 1 } },
        );
      }
    }

    // 3. CREATE OR UPDATE LOGIC
    let updatedDept;
    if (numericId === 0) {
      // --- CREATE ---
      const lastDept = await departmentModel.findOne().sort({ id: -1 });
      const nextId = lastDept ? lastDept.id + 1 : 1;

      updatedDept = await departmentModel.create({
        id: nextId,
        name: trimmedName,
        manager_id: finalManagerId || 0,
        status: 1,
      });
    } else {
      // --- UPDATE ---
      const updateData = { name: trimmedName };
      if (finalManagerId !== undefined) updateData.manager_id = finalManagerId;

      updatedDept = await departmentModel.findOneAndUpdate(
        { id: numericId, status: 1 },
        { $set: updateData },
        { new: true },
      );

      if (!updatedDept)
        return res
          .status(404)
          .json({ status: false, message: "Department not found" });
    }

    // --- DEMOTION LOGIC ---
    if (
      numericId !== 0 &&
      oldManagerId !== 0 &&
      oldManagerId !== finalManagerId
    ) {
      const otherDepts = await departmentModel.findOne({
        manager_id: oldManagerId,
        status: 1,
        id: { $ne: numericId },
      });

      if (!otherDepts) {
        await userModel.findOneAndUpdate(
          { id: oldManagerId },
          { $set: { is_manager: 0 } },
        );
      }
    }

    return res.status(numericId === 0 ? 201 : 200).json({
      status: true,
      message: "Department processed and Manager status synced",
      data: updatedDept,
    });
  } catch (err) {
    console.error("Dept Error:", err);
    return res
      .status(500)
      .json({ status: false, message: "Internal Error", detail: err.message });
  }
}

async function getDepartmentController(req, res) {
  try {
    // 1. Fetch all departments that are not deleted.
    // status: 1 => Active, 0 => Inactive, -1 => Deleted
    // -__v and -_id are excluded for a clean response
    const departments = await departmentModel
      .find({ status: 1 })
      .select("-__v -_id")
      .sort({ id: 1 })
      .lean();

    // 2. Return the data
    return res.status(200).json({
      status: true,
      message: "success",
      data: departments,
    });
  } catch (err) {
    console.error("Get Department Error:", err);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
}

async function deleteDepartmentController(req, res) {
  try {
    // 1. Get ID from body (safety fallback)
    let { id } = req.body || {};

    // 2. Simple Validation
    if (id === undefined || id === null) {
      return res.status(400).json({
        status: false,
        message: "The id field is required",
      });
    }

    const deptId = Number(id);

    // 3. Perform Soft Delete using status: 1
    // We ONLY find the department if it is currently active (status 1)
    const deletedDept = await departmentModel.findOneAndUpdate(
      { id: deptId, status: 1 },
      { $set: { status: -1 } },
      { new: true },
    );

    // 4. Standard Response
    // If deletedDept is null, it means it wasn't status 1 (already deleted or wrong ID)
    if (!deletedDept) {
      return res.status(404).json({
        status: false,
        message: "Department not found or already inactive",
      });
    }

    return res.status(200).json({
      status: true,
      message: "success",
    });
  } catch (err) {
    console.error("Delete Dept Error:", err);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
}

module.exports = {
  createDepartmentController,
  getDepartmentController,
  deleteDepartmentController,
};
