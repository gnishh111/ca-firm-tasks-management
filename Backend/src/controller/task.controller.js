const taskModel = require("../models/task.model");
const customerFirmModel = require("../models/customer_firm.model");
const serviceModel = require("../models/service.model");

async function createTask(req, res) {
  try {
    const body = req.body || {};
    let {
      id,
      customer_id,
      firm_id,
      service_id,
      title,
      description,
      priority,
      task_status,
      created_by,
      manager_id,
      next_run_date,
      last_run_date,
      due_date,
      task_period,
    } = body;

    const numericId =
      id !== undefined && id !== "" && id !== null ? Number(id) : NaN;

    if (isNaN(numericId)) {
      return res.status(400).json({
        status: false,
        message: "Valid ID is required (0 for new task)",
      });
    }

    // --- EXPANDED ERROR VALIDATION ---
    let errors = [];
    if (numericId === 0) {
      if (!customer_id) errors.push("customer_id is required");
      if (!firm_id) errors.push("firm_id is required");
      if (!service_id) errors.push("service_id is required");
      if (!title || title.trim() === "") errors.push("title is required");
      if (!created_by) errors.push("created_by is required");
      if (!manager_id) errors.push("manager_id is required");
      if (!priority) errors.push("priority is required");
      if (!task_period) errors.push("task_period is required");
    }

    if (errors.length > 0) {
      return res
        .status(400)
        .json({ status: false, message: errors.join(", ") });
    }

    // --- NEW FIX: CHECK FIRM/SERVICE STATUS FOR BOTH CREATE AND UPDATE ---
    // If the user provides these IDs, we must ensure they are active
    if (firm_id || service_id) {
      const checkPromises = [];
      if (firm_id)
        checkPromises.push(
          customerFirmModel
            .findOne({ id: Number(firm_id), status: 1 })
            .select("id")
            .lean(),
        );
      if (service_id)
        checkPromises.push(
          serviceModel
            .findOne({ id: Number(service_id), status: 1 })
            .select("id")
            .lean(),
        );

      const [firmExists, serviceExists] = await Promise.all(checkPromises);

      if (firm_id && !firmExists) {
        return res
          .status(404)
          .json({
            status: false,
            message: "The selected Firm is inactive or does not exist.",
          });
      }
      if (service_id && !serviceExists) {
        return res
          .status(404)
          .json({
            status: false,
            message: "The selected Service is inactive or does not exist.",
          });
      }
    }

    // Prepare standardized data
    let taskData = {
      customer_id: Number(customer_id),
      firm_id: Number(firm_id),
      service_id: Number(service_id),
      title: title,
      description: description || "",
      priority: priority,
      task_status: task_status || "Pending",
      created_by: Number(created_by),
      manager_id: Number(manager_id),
      task_period: task_period,
      status: 1,
    };

    // --- TIMEZONE NORMALIZATION ---
    if (next_run_date)
      taskData.next_run_date = new Date(
        new Date(next_run_date).setUTCHours(0, 0, 0, 0),
      );
    if (last_run_date)
      taskData.last_run_date = new Date(
        new Date(last_run_date).setUTCHours(0, 0, 0, 0),
      );
    if (due_date)
      taskData.due_date = new Date(
        new Date(due_date).setUTCHours(23, 59, 59, 999),
      );

    if (numericId === 0) {
      // --- CREATE LOGIC ---
      let retryCount = 0,
        success = false,
        result;
      while (retryCount < 3 && !success) {
        try {
          const lastEntry = await taskModel
            .findOne()
            .sort({ id: -1 })
            .select("id")
            .lean();
          taskData.id = (lastEntry?.id || 0) + 1;
          result = await taskModel.create(taskData);
          success = true;
        } catch (dbErr) {
          if (dbErr.code === 11000) retryCount++;
          else throw dbErr;
        }
      }
      if (!success)
        return res
          .status(409)
          .json({ status: false, message: "ID conflict, try again." });

      return res
        .status(201)
        .json({
          status: true,
          message: "Task created successfully",
          data: result,
        });
    } else {
      // --- UPDATE LOGIC ---
      // We search for the task specifically where status is 1
      const result = await taskModel
        .findOneAndUpdate(
          { id: numericId, status: 1 },
          { $set: taskData },
          { new: true },
        )
        .lean();

      if (!result) {
        return res
          .status(404)
          .json({
            status: false,
            message: "Task not found or already deleted",
          });
      }

      return res
        .status(200)
        .json({
          status: true,
          message: "Task updated successfully",
          data: result,
        });
    }
  } catch (err) {
    console.error("Critical Task Error:", err);
    return res
      .status(500)
      .json({
        status: false,
        message: "Internal Server Error",
        error: err.message,
      });
  }
}

async function getTask(req, res) {
  try {
    const body = req.body || {};

    // We start with status: 1 to ensure we never show soft-deleted records
    let query = { status: 1 };

    // --- 1. DYNAMIC FIELD FILTERING ---
    // List of numeric fields to filter if provided
    const numericFields = [
      "id",
      "customer_id",
      "firm_id",
      "service_id",
      "created_by",
      "manager_id",
    ];

    numericFields.forEach((field) => {
      if (
        body[field] !== undefined &&
        body[field] !== "" &&
        body[field] !== null
      ) {
        query[field] = Number(body[field]);
      }
    });

    // List of string fields to filter if provided
    const stringFields = ["priority", "task_status", "task_period"];

    stringFields.forEach((field) => {
      if (body[field] && body[field].trim() !== "") {
        query[field] = body[field];
      }
    });

    // --- 2. DYNAMIC DATE RANGE FILTERING ---
    // This looks for due_date between start_date and end_date
    if (body.start_date || body.end_date) {
      query.due_date = {};
      if (body.start_date) {
        query.due_date.$gte = new Date(
          new Date(body.start_date).setUTCHours(0, 0, 0, 0),
        );
      }
      if (body.end_date) {
        query.due_date.$lte = new Date(
          new Date(body.end_date).setUTCHours(23, 59, 59, 999),
        );
      }
    }

    // --- 3. EXECUTION ---
    const tasks = await taskModel
      .find(query)
      .sort({ id: 1 }) // Newest tasks at the top
      .lean();

    // --- 4. RESPONSE ---
    return res.status(200).json({
      status: true,
      total_count: tasks.length,
      data: tasks,
    });
  } catch (err) {
    console.error("GetTask Error:", err);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
}

async function deleteTask(req, res) {
  try {
    const body = req.body || {};
    const { id } = body;

    // --- 1. ID VALIDATION ---
    const numericId =
      id !== undefined && id !== "" && id !== null ? Number(id) : NaN;

    if (isNaN(numericId) || numericId === 0) {
      return res.status(400).json({
        status: false,
        message: "A valid Task ID is required for deletion",
      });
    }

    // --- 2. EXECUTE SOFT DELETE ---
    // We update status to -1 and trigger the IST updated_at middleware
    const result = await taskModel
      .findOneAndUpdate(
        { id: numericId, status: 1 }, // Only delete if it's currently active
        { $set: { status: -1 } },
        { new: true },
      )
      .lean();

    // --- 3. RESPONSE HANDLING ---
    if (!result) {
      return res.status(404).json({
        status: false,
        message: "Task not found or already deleted",
      });
    }

    return res.status(200).json({
      status: true,
      message: `Task ${numericId} has been deleted successfully`,
      // We return the ID of the deleted task for confirmation
      data: { id: result.id },
    });
  } catch (err) {
    console.error("DeleteTask Error:", err);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
}

module.exports = { createTask, getTask, deleteTask };