const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const reportController = require('../controllers/reportController');

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/reports'));
  },
  filename: (req, file, cb) => {
    // Unique filename: timestamp-originalname
    cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_'));
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 } // 1MB
});

// Upload report
router.post('/upload', upload.single('file'), reportController.uploadReport);

// Get all reports for a student
router.get('/', reportController.getReports);

// Get all reports (admin)
router.get('/admin/all', reportController.getAllReports);

// Update report (admin)
router.put('/admin/:id', reportController.updateReport);

module.exports = router;