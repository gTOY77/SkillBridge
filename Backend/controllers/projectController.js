const Project = require('../models/Project');

exports.createProject = async (req, res) => {
  try {
    const { title, description, category, skillsRequired, budget, deadline } = req.body;

    // Only clients can create projects
    if (req.userRole !== 'client') {
      return res.status(403).json({
        success: false,
        message: 'Only clients can create projects',
      });
    }

    if (!title || !description || !category || !budget || !deadline) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    const project = await Project.create({
      title,
      description,
      category,
      skillsRequired: skillsRequired || [],
      budget,
      deadline,
      createdBy: req.userId,
    });

    await project.populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating project',
      error: error.message,
    });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const projects = await Project.find()
      .populate('createdBy', '_id name email')
      .populate('assignedTo', '_id name email')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Project.countDocuments();

    res.status(200).json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching projects',
      error: error.message,
    });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('createdBy', 'name email rating')
      .populate('assignedTo', 'name email rating');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching project',
      error: error.message,
    });
  }
};

exports.updateProject = async (req, res) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    if (project.createdBy.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this project',
      });
    }

    project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating project',
      error: error.message,
    });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    if (project.createdBy.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this project',
      });
    }

    await Project.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting project',
      error: error.message,
    });
  }
};

exports.searchProjects = async (req, res) => {
  try {
    const { category, skills, minBudget, maxBudget } = req.query;

    let filter = {};

    if (category) {
      filter.category = category;
    }

    if (skills) {
      const skillArray = skills.split(',').map((s) => s.trim());
      filter['skillsRequired.name'] = { $in: skillArray };
    }

    if (minBudget || maxBudget) {
      filter.budget = {};
      if (minBudget) filter.budget.$gte = parseFloat(minBudget);
      if (maxBudget) filter.budget.$lte = parseFloat(maxBudget);
    }

    const projects = await Project.find(filter)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching projects',
      error: error.message,
    });
  }
};

exports.placeBid = async (req, res) => {
  try {
    const { bidAmount, bidMessage } = req.body;

    if (!bidAmount) {
      return res.status(400).json({
        success: false,
        message: 'Please provide bid amount',
      });
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    project.bids.push({
      userId: req.userId,
      bidAmount,
      bidMessage: bidMessage || '',
    });

    await project.save();

    res.status(200).json({
      success: true,
      message: 'Bid placed successfully',
      project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error placing bid',
      error: error.message,
    });
  }
};
