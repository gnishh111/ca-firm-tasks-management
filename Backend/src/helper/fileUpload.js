const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadFile = (folderName) => {
  // ✅ Absolute path (CORRECT)
  const uploadPath = path.join(__dirname, "..", "public", folderName);

  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 8);
      const ext = path.extname(file.originalname);
      cb(null, `${timestamp}-${randomStr}${ext}`);
    },
  });

  return multer({ storage });
};

const getFullImageUrlFromRequest = (req, relativePath) => {
  if (!relativePath) return null;
  return `${req.protocol}://${req.get("host")}${relativePath}`;
};

module.exports = {
  uploadFile,
  helper: { getFullImageUrlFromRequest },
};
