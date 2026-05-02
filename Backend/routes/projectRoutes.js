const express = require('express');
const router = express.Router();
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  searchProjects,
  placeBid,
} = require('../controllers/projectController');
const { auth } = require('../middleware/auth');

router.post('/', auth, createProject);
router.get('/', getProjects);
router.get('/search', searchProjects);
router.get('/:id', getProjectById);
router.put('/:id', auth, updateProject);
router.delete('/:id', auth, deleteProject);
router.post('/:id/bid', auth, placeBid);

module.exports = router;
