const User = require('../models/User');

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user profile',
      error: error.message,
    });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    if (req.userId !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this profile',
      });
    }

    const { name, bio, profileImage, university, major, hourlyRate, skills } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        name,
        bio,
        profileImage,
        university,
        major,
        hourlyRate,
        skills: skills || undefined,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message,
    });
  }
};

exports.getAllExperts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const experts = await User.find({ role: 'expert' })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-password');

    console.log(`Found ${experts.length} experts, total: ${await User.countDocuments({ role: 'expert' })}`);

    const total = await User.countDocuments({ role: 'expert' });

    res.status(200).json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      experts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching experts',
      error: error.message,
    });
  }
};

exports.searchExperts = async (req, res) => {
  try {
    const { skills, minRating } = req.query;

    let filter = { role: 'expert' };

    if (skills) {
      const skillArray = skills.split(',').map((s) => s.trim());
      filter.skills = { $in: skillArray };
    }

    if (minRating) {
      filter.rating = { $gte: parseFloat(minRating) };
    }

    const experts = await User.find(filter).select('-password');

    res.status(200).json({
      success: true,
      count: experts.length,
      experts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching experts',
      error: error.message,
    });
  }
};

exports.addSkill = async (req, res) => {
  try {
    const { skillName } = req.body;

    if (!skillName) {
      return res.status(400).json({
        success: false,
        message: 'Please provide skill name',
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const skillExists = user.skills.find((skill) => skill.toLowerCase() === skillName.toLowerCase());
    if (skillExists) {
      return res.status(400).json({
        success: false,
        message: 'Skill already added',
      });
    }

    user.skills.push(skillName);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Skill added successfully',
      skills: user.skills,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding skill',
      error: error.message,
    });
  }
};

exports.removeSkill = async (req, res) => {
  try {
    const { skillName } = req.params;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    user.skills = user.skills.filter((skill) => skill.toLowerCase() !== skillName.toLowerCase());
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Skill removed successfully',
      skills: user.skills,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error removing skill',
      error: error.message,
    });
  }
};
