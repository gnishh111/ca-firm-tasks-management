const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { helper } = require("../helper/fileUpload");
const fs = require("fs");
const path = require("path");

async function createUserController(req, res) {
  try {
    const imagePath = req.file ? `/images/User/${req.file.filename}` : null;

    // Destructure profile_pic from body to check if user sent "null" or "" (text)
    let { id, name, email, phone, password, role, is_manager, profile_pic } =
      req.body || {};
    const numericId = Number(id);
    const errors = [];

    // ... (Validation & Duplicate Check code remains the same as previous) ...
    // [Hidden to save space, assuming you have the previous validation code]
    if (id === undefined || id === null || isNaN(numericId))
      errors.push("The id field is required");
    if (!name || name.trim() === "") errors.push("The name field is required");
    // ... validation ...
    if (errors.length > 0) {
      if (req.file) fs.unlink(req.file.path, () => {});
      return res
        .status(400)
        .json({ status: false, message: errors.join(", ") });
    }
    const conflictUser = await userModel.findOne({
      $or: [{ email: email.toLowerCase() }, { phone }],
      id: { $ne: numericId },
      status: 1,
    });
    if (conflictUser) {
      if (req.file) fs.unlink(req.file.path, () => {});
      return res
        .status(400)
        .json({ status: false, message: "Email or Phone already exists" });
    }

    // ================= LOGIC START =================
    if (numericId === 0) {
      // ... (Create Logic remains the same) ...
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const lastUser = await userModel.findOne().sort({ id: -1 });
      const nextId = lastUser ? lastUser.id + 1 : 1;
      const newUser = await userModel.create({
        id: nextId,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
        password: hashedPassword,
        profile_pic: imagePath,
        role: role,
        is_manager: is_manager || 0,
        token: "",
        status: 1,
      });
      const response = newUser.toObject();
      if (response.profile_pic)
        response.profile_pic = helper.getFullImageUrlFromRequest(
          req,
          response.profile_pic,
        );
      delete response._id;
      delete response.__v;
      delete response.password;
      delete response.status;
      return res
        .status(201)
        .json({ status: true, message: "success", data: response });
    } else {
      // ---------------- UPDATE FIX START ----------------

      const oldUser = await userModel
        .findOne({ id: numericId, status: 1 })
        .lean();

      if (!oldUser) {
        if (req.file) fs.unlink(req.file.path, () => {});
        return res
          .status(404)
          .json({ status: false, message: "User not found" });
      }

      const updateData = {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
        role: role,
      };

      if (is_manager !== undefined) updateData.is_manager = is_manager;
      if (password && password.trim() !== "") {
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(password, salt);
      }

      // === FIXED IMAGE LOGIC ===
      // We need to decide if we are updating the image field
      let finalImagePath = undefined;

      if (req.file) {
        // Case 1: User uploaded a NEW file
        finalImagePath = imagePath;
      } else if (
        profile_pic === "" ||
        profile_pic === "null" ||
        profile_pic === null
      ) {
        // Case 2: User Explicitly wants to REMOVE the image (sent empty string or "null" text)
        finalImagePath = ""; // Clear the field in DB
      }
      // Case 3 (Default): User sent nothing. finalImagePath stays undefined. We keep the old image.

      if (finalImagePath !== undefined) {
        updateData.profile_pic = finalImagePath;

        // If we are changing the image (either to new one OR to empty), delete the OLD file
        if (oldUser.profile_pic) {
          const absoluteOldPath = path.join(
            __dirname,
            "..",
            "public",
            oldUser.profile_pic,
          );
          // Check if file exists before trying to delete
          if (fs.existsSync(absoluteOldPath)) {
            fs.unlink(absoluteOldPath, (err) => {
              if (err)
                console.error(
                  "Old profile pic deletion failed:",
                  absoluteOldPath,
                );
            });
          }
        }
      }

      const updatedUser = await userModel
        .findOneAndUpdate(
          { id: numericId, status: 1 },
          { $set: updateData },
          { new: true },
        )
        .lean();

      // Prepare Response
      if (updatedUser.profile_pic) {
        updatedUser.profile_pic = helper.getFullImageUrlFromRequest(
          req,
          updatedUser.profile_pic,
        );
      }

      delete updatedUser._id;
      delete updatedUser.__v;
      delete updatedUser.password;
      delete updatedUser.status;

      return res.status(200).json({
        status: true,
        message: "success",
        data: updatedUser,
      });
    }
  } catch (err) {
    if (req.file) fs.unlink(req.file.path, () => {});
    console.error("Controller Error:", err);
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
  }
}

async function loginUserController(req, res) {
  try {
    let { phone, password } = req.body || {};
    let error = [];

    // 2. Validation
    const phoneInput = phone ? phone.toString().trim() : "";

    if (!phoneInput) {
      error.push("The phone field is required");
    } else {
      if (!/^\d+$/.test(phoneInput))
        error.push("The phone field must be a number");
      if (phoneInput.length !== 10)
        error.push("The phone field must be 10 digits");
    }
    if (!password) {
      error.push("The password field is required");
    }

    if (error.length > 0) {
      return res.status(400).json({ status: false, message: error.join(", ") });
    }

    // 3. Find ONLY Active User (status 1)
    const user = await userModel
      .findOne({ phone: phoneInput, status: 1 })
      .lean();

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found or account is inactive",
      });
    }

    // 4. Verify Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        status: false,
        message: "Invalid Password",
      });
    }

    // 5. Generate JWT Token
    // Ensure JWT_SECRET_KEY is defined in your .env file
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);

    // 6. Update the empty token field in the database
    const updatedUser = await userModel
      .findOneAndUpdate(
        { id: user.id, status: 1 },
        { $set: { token: token } },
        { new: true },
      )
      .select("-password -__v")
      .lean();

    if (!updatedUser) {
      return res.status(403).json({
        status: false,
        message: "Account was deactivated during login",
      });
    }

    // 7. Success Response
    return res.status(200).json({
      status: true,
      message: "Login successful",
      user_detail: updatedUser,
    });
  } catch (err) {
    console.error("User Login Error:", err);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
}

async function getUserController(req, res) {
  try {
    let { role } = req.body || {};

    // --- FIXED LOOPHOLE LOGIC ---
    // Check if the role provided is valid
    const validRoles = ["customer", "employee"];

    if (!role || !validRoles.includes(role)) {
      return res.status(400).json({
        status: false,
        message: "Invalid role value. Must be customer or employee.",
      });
    }

    // Only fetch active users with the specific role
    let filter = { role: role, status: 1 };

    const users = await userModel
      .find(filter)
      .select("-password -__v -token -_id") // Exclude sensitive fields
      .sort({ id: 1 })
      .lean(); // Returns plain JavaScript objects (faster)

    // === IMAGE URL TRANSFORMATION START ===
    // Loop through all users and update the profile_pic with the full URL
    users.forEach((user) => {
      if (user.profile_pic) {
        user.profile_pic = helper.getFullImageUrlFromRequest(
          req,
          user.profile_pic,
        );
      }
    });
    // === IMAGE URL TRANSFORMATION END ===

    return res.status(200).json({
      status: true,
      message: "success",
      user_list: users,
    });
  } catch (err) {
    console.error("Get User Error:", err);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
}

async function deleteUserController(req, res) {
  try {
    let { id } = req.body || {};

    const numericId = Number(id);

    if (id === undefined || id === null || isNaN(numericId)) {
      return res
        .status(400)
        .json({ status: false, message: "The id field is required" });
    }
    const deletedUser = await userModel.findOneAndUpdate(
      { id: numericId, status: 1 },
      { $set: { status: -1 } },
      { new: true },
    );
    if (!deletedUser) {
      return res.status(404).json({ status: false, message: "User not found" });
    }
    return res.status(200).json({
      status: true,
      message: "success",
    });
  } catch (err) {
    console.error("Delete User Error:", err);
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
  }
}

module.exports = {
  createUserController,
  loginUserController,
  getUserController,
  deleteUserController,
};
