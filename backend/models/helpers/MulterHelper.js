const multer = require('multer');
const path = require('path');

const dir = './uploads'; // Upload directory

// Configure storage
const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// Create multer upload instance
const upload = multer({ storage: fileStorageEngine });

// Helper function to generate local file URL
const generateLocalFileUrl = (filename) => {
  return `/uploads/${filename}`;
};

module.exports = {
  upload,
  generateLocalFileUrl,
};
