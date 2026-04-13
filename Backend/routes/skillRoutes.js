const express = require('express');
const router = express.Router();
const {
  getAllSkills,
  createSkill,
  getSkillsByCategory,
  deleteSkill,
} = require('../controllers/skillController');

router.get('/', getAllSkills);
router.post('/', createSkill);
router.get('/category/:category', getSkillsByCategory);
router.delete('/:id', deleteSkill);

module.exports = router;
