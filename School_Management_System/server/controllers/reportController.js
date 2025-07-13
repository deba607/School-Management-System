const Report = require('../models/Report');
const path = require('path');

exports.uploadReport = async (req, res) => {
  try {
    const {
      studentEmail, studentName, rollNo, stream, year, sem, sec, group, docType
    } = req.body;
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const fileUrl = `/uploads/reports/${req.file.filename}`;

    const report = new Report({
      studentEmail, studentName, rollNo, stream, year, sem, sec, group, docType,
      fileName: req.file.originalname,
      fileUrl
    });
    await report.save();
    res.status(201).json({ message: 'Report uploaded', report });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Upload failed' });
  }
};

exports.getReports = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: 'Email is required' });
    const reports = await Report.find({ studentEmail: email }).sort({ date: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to fetch reports' });
  }
};



// Get all reports (optionally filter by status/type)
exports.getAllReports = async (req, res) => {
  try {
    const { status, docType, email } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (docType) filter.docType = docType;
    if (email) filter.studentEmail = email;
    const reports = await Report.find(filter).sort({ date: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to fetch reports' });
  }
};

// Update report status/remarks
exports.updateReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remarks } = req.body;
    const report = await Report.findByIdAndUpdate(
      id,
      { status, remarks },
      { new: true }
    );
    if (!report) return res.status(404).json({ message: 'Report not found' });
    res.json(report);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to update report' });
  }
};