const Skill = require('../models/Skill');

exports.getAllSkills = async (req, res) => {
  try {
    const skills = await Skill.find().sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: skills.length,
      skills,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching skills',
      error: error.message,
    });
  }
};

exports.createSkill = async (req, res) => {
  try {
    const { name, category, description } = req.body;

    if (!name || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide skill name and category',
      });
    }

    const skillExists = await Skill.findOne({ name: { $regex: name, $options: 'i' } });

    if (skillExists) {
      return res.status(400).json({
        success: false,
        message: 'Skill already exists',
      });
    }

    const skill = await Skill.create({
      name,
      category,
      description: description || '',
    });

    res.status(201).json({
      success: true,
      message: 'Skill created successfully',
      skill,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating skill',
      error: error.message,
    });
  }
};

exports.getSkillsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const skills = await Skill.find({ category }).sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: skills.length,
      skills,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching skills',
      error: error.message,
    });
  }
};

exports.deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Skill deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting skill',
      error: error.message,
    });
  }
};
