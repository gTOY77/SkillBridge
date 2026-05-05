const Report = require('../models/Report');

// 1. Submit a new report
exports.createReport = async (req, res) => {
  try {
    const { description } = req.body;
    
    // We use req.userId (or req.user._id depending on your auth middleware)
    const userId = req.userId || req.user._id || req.user.id;

    const newReport = await Report.create({
      description,
      reportedBy: userId
    });

    res.status(201).json({ success: true, message: 'Report submitted successfully', report: newReport });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// 2. Admin views all reports
exports.getReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('reportedBy', 'name role') // Gets the name and role of who reported it
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: reports.length, reports });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// In backend/controllers/reportController.js
exports.resolveReport = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the report by ID and change its status to 'Resolved'
    const updatedReport = await Report.findByIdAndUpdate(
      id, 
      { status: 'Resolved' }, 
      { new: true }
    );

    if (!updatedReport) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.status(200).json({ message: 'Report resolved successfully', report: updatedReport });
  } catch (error) {
    res.status(500).json({ message: 'Server error updating report' });
  }
};