const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  getAllExperts,
  searchExperts,
  addSkill,
  removeSkill,
} = require('../controllers/userController');
const auth = require('../middleware/auth');

router.get('/:id', getUserProfile);
router.put('/:id', auth, updateUserProfile);
router.get('/experts/list', getAllExperts);
router.get('/search/experts', searchExperts);
router.post('/:id/skills', auth, addSkill);
router.delete('/:id/skills/:skillName', auth, removeSkill);

module.exports = router;
