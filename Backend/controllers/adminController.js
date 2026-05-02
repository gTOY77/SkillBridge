const User = require('../models/User'); // Adjust path to your User model
const Project = require('../models/Project'); // Adjust path to your Project model

// 1. Get Platform Analytics
exports.getSystemStats = async (req, res) => {
  try {
    // Count total users
    const totalUsers = await User.countDocuments();
    
    // Count active projects (adjust the status string to match your database)
    const activeProjects = await Project.countDocuments({ status: 'Open' }); 
    
    // Calculate total revenue (Example: Sum of budgets from completed projects)
    const revenueData = await Project.aggregate([
      { $match: { status: 'Completed' } },
      { $group: { _id: null, total: { $sum: '$budget' } } }
    ]);
    const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

    // Open disputes (mocked for now, or query your Disputes model if you have one)
    const openDisputes = 0; 

    res.json({
      totalUsers,
      activeProjects,
      totalRevenue,
      openDisputes
    });
  } catch (error) {
    console.error("Stats Error:", error);
    res.status(500).json({ message: 'Failed to fetch system stats' });
  }
};

// 2. Get Users for the Control Panel
exports.getRecentUsers = async (req, res) => {
  try {
    // Fetch latest users, excluding their passwords
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};
exports.updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body; // Getting the new status from the button
    
    // Find the user and update their status
    const user = await User.findByIdAndUpdate(
      req.params.id, 
      { status: status }, 
      { new: true, runValidators: true } // runValidators ensures it checks our new Enum!
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: `User status updated to ${status}`, user });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ message: 'Server error while updating status' });
  }
};