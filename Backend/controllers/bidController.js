const Bid = require('../models/Bid');
const Project = require('../models/Project');
const Notification = require('../models/Notification');
const User = require('../models/User');

// @desc    Place a bid on a project
// @route   POST /api/bids/:projectId
// @access  Private (Expert only)
exports.placeBid = async (req, res) => {
  try {
    const { 
      bidAmount, 
      proposedTimeline, 
      costBreakdown, 
      relevantExperience, 
      projectApproach, 
      message 
    } = req.body;
    const { projectId } = req.params;
    const expertId = req.userId;

    // 1. Validation: Ensure user is an expert
    const user = await User.findById(expertId);
    if (user.role !== 'expert') {
      return res.status(403).json({ success: false, message: 'Only experts can place bids' });
    }

    // 2. Validation: Ensure project exists and is open
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    if (project.status !== 'open') {
      return res.status(400).json({ success: false, message: 'Bidding is closed for this project' });
    }

    // 3. Validation: Bid amount within budget constraints (optional but recommended)
    if (bidAmount > project.budget * 1.5) { // Example: max 50% over budget
       return res.status(400).json({ success: false, message: 'Bid amount exceeds project budget constraints' });
    }

    // 4. Check for existing bid
    let bid = await Bid.findOne({ projectId, expertId });
    if (bid) {
      return res.status(400).json({ success: false, message: 'You have already placed a bid on this project' });
    }

    // 5. Create bid
    bid = await Bid.create({
      projectId,
      expertId,
      bidAmount,
      proposedTimeline,
      costBreakdown,
      relevantExperience,
      projectApproach,
      message
    });

    // 6. Create Notification for Client
    await Notification.create({
      recipient: project.createdBy,
      sender: expertId,
      type: 'new_bid',
      title: 'New Bid Received',
      content: `A new bid of $${bidAmount} has been placed on your project: ${project.title}`,
      link: `/projects/${projectId}`,
      data: { 
        projectId: projectId.toString(), 
        bidId: bid._id.toString(),
        bidAmount: bidAmount.toString()
      }
    });

    console.log(`[AUDIT] Expert ${expertId} placed a bid of $${bidAmount} on project ${projectId}`);

    res.status(201).json({
      success: true,
      message: 'Bid placed successfully',
      data: bid
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error placing bid', error: error.message });
  }
};

// @desc    Get bids for a project
// @route   GET /api/bids/project/:projectId
// @access  Private (Client or involved Expert)
exports.getProjectBids = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.userId;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // If expert, only show their own bid. If client, show all.
    let query = { projectId };
    if (req.userRole === 'expert') {
      query.expertId = userId;
    } else if (project.createdBy.toString() !== userId && req.userRole !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view bids' });
    }

    const bids = await Bid.find(query)
      .populate('expertId', 'name rating totalReviews profileImage')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bids.length,
      data: bids
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching bids', error: error.message });
  }
};

// @desc    Select a bid (Award project)
// @route   PUT /api/bids/:bidId/select
// @access  Private (Client only)
exports.selectBid = async (req, res) => {
  try {
    const { bidId } = req.params;
    const userId = req.userId;

    const bid = await Bid.findById(bidId).populate('projectId');
    if (!bid) {
      return res.status(404).json({ success: false, message: 'Bid not found' });
    }

    const project = bid.projectId;
    if (project.createdBy.toString() !== userId) {
      return res.status(403).json({ success: false, message: 'Not authorized to select bids for this project' });
    }

    if (project.status !== 'open') {
      return res.status(400).json({ success: false, message: 'Project is no longer open for bidding' });
    }

    // 1. Update project status and assign expert
    project.status = 'in-progress';
    project.assignedTo = bid.expertId;
    await project.save();

    // 2. Update bid status
    bid.status = 'selected';
    await bid.save();

    // 3. Reject other bids
    await Bid.updateMany(
      { projectId: project._id, _id: { $ne: bidId } },
      { $set: { status: 'rejected' } }
    );

    // 4. Notify the selected expert
    await Notification.create({
      recipient: bid.expertId,
      sender: userId,
      type: 'bid_selected',
      title: 'Bid Selected!',
      content: `Congratulations! Your bid has been selected for the project: ${project.title}`,
      link: `/projects/${project._id}`,
      data: { 
        projectId: project._id.toString(), 
        bidId: bid._id.toString(),
        budget: project.budget.toString() 
      }
    });

    console.log(`[AUDIT] Project ${project._id} awarded to expert ${bid.expertId} by client ${userId}. Budget: ${project.budget}`);

    res.status(200).json({
      success: true,
      message: 'Bid selected and project awarded successfully',
      data: bid
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error selecting bid', error: error.message });
  }
};

// @desc    Get bids by expert
// @route   GET /api/bids/expert
// @access  Private (Expert only)
exports.getExpertBids = async (req, res) => {
  try {
    const expertId = req.userId;

    const bids = await Bid.find({ expertId })
      .populate('projectId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bids.length,
      data: bids
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching expert bids', error: error.message });
  }
};

// @desc    Get current user's notifications
// @route   GET /api/bids/notifications
// @access  Private
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.userId })
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      data: notifications
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching notifications', error: error.message });
  }
};
