const userDeptModel = require("../models/user_department.model");
const userModel = require("../models/user.model");
const departmentModel = require("../models/department.model");

async function createUserDepartmentController(req, res) {
  try {
    let { id, user_id, department_id } = req.body || {};
    const numericId = Number(id);
    let errors = [];

    // 1. Validation
    if (id === undefined || id === null || isNaN(numericId))
      errors.push("The id field is required");
    if (!user_id) errors.push("The user_id field is required");
    if (!department_id) errors.push("The department_id field is required");

    if (errors.length > 0) {
      return res
        .status(400)
        .json({ status: false, message: errors.join(", ") });
    }

    // 2. Existence Check
    const [userExists, deptExists] = await Promise.all([
      userModel.findOne({ id: user_id, status: 1 }),
      departmentModel.findOne({ id: department_id, status: 1 }),
    ]);

    if (!userExists)
      return res.status(404).json({ status: false, message: "User not found" });
    if (!deptExists)
      return res
        .status(404)
        .json({ status: false, message: "Department not found" });

    // 3. CHECK: One user cannot be assigned to same department twice
    // This prevents duplicate user-department combinations
    const duplicateCheck = await userDeptModel.findOne({
      user_id: user_id,
      department_id: department_id,
      id: { $ne: numericId },
      status: 1,
    });

    if (duplicateCheck) {
      return res.status(400).json({
        status: false,
        message: "This user is already assigned to this department.",
      });
    }

    // --- NOTE: REMOVED THE DEPARTMENT CHECK ---
    // Now multiple employees can be assigned to the same department
    // The old check that prevented multiple users in one department is removed

    // 4. Create or Update Logic
    if (numericId === 0) {
      // --- CREATE ---
      const lastRecord = await userDeptModel.findOne().sort({ id: -1 });
      const nextId = lastRecord ? lastRecord.id + 1 : 1;

      const newMapping = await userDeptModel.create({
        id: nextId,
        user_id: user_id,
        department_id: department_id,
        status: 1,
      });

      return res.status(201).json({
        status: true,
        message: "User assigned to department successfully",
        data: newMapping,
      });
    } else {
      // --- UPDATE ---
      const updatedMapping = await userDeptModel.findOneAndUpdate(
        { id: numericId, status: 1 },
        { $set: { user_id, department_id } },
        { new: true },
      );

      if (!updatedMapping) {
        return res
          .status(404)
          .json({ status: false, message: "Record not found" });
      }

      return res.status(200).json({
        status: true,
        message: "Assignment updated successfully",
        data: updatedMapping,
      });
    }
  } catch (err) {
    console.error("User-Dept Error:", err);
    return res.status(500).json({ status: false, message: "Internal Error" });
  }
}

async function getUserDepartmentController(req, res) {
  try {
    // 1. Get filters from body
    let { user_id, department_id } = req.body || {};

    // 2. Build the filter object (Only active records)
    let filter = { status: 1 };

    // If user_id is provided, add to filter
    if (user_id !== undefined && user_id !== null && user_id !== "") {
      filter.user_id = Number(user_id);
    }

    // If department_id is provided, add to filter
    if (
      department_id !== undefined &&
      department_id !== null &&
      department_id !== ""
    ) {
      filter.department_id = Number(department_id);
    }

    // 3. Fetch data directly from the User-Department table
    const data = await userDeptModel
      .find(filter)
      .select("-__v -_id") // Only show the fields from your model
      .sort({ id: 1 })
      .lean();

    // 4. Return the data
    return res.status(200).json({
      status: true,
      message: "success",
      data: data,
    });
  } catch (err) {
    console.error("Get User-Dept Error:", err);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
}

async function deleteUserDepartmentController(req, res) {
  try {
    let { id } = req.body || {};
    const numericId = Number(id);

    if (id === undefined || id === null || isNaN(numericId)) {
      return res
        .status(400)
        .json({ status: false, message: "The id field is required" });
    }
    const deletedMapping = await userDeptModel.findOneAndUpdate(
      { id: numericId, status: 1 },
      { $set: { status: -1 } },
      { new: true },
    );
    if (!deletedMapping) {
      return res
        .status(404)
        .json({ status: false, message: "Record not found" });
    }
    return res.status(200).json({ status: true, message: "success" });
  } catch (err) {
    console.error("Delete User-Dept Error:", err);
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
  }
}

module.exports = {
  createUserDepartmentController,
  getUserDepartmentController,
  deleteUserDepartmentController,
};
