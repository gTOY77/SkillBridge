const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  placeBid,
  getProjectBids,
  getExpertBids,
  selectBid,
  getNotifications
} = require('../controllers/bidController');

router.use(auth);

router.post('/:projectId', placeBid);
router.get('/project/:projectId', getProjectBids);
router.get('/expert', getExpertBids);
router.put('/:bidId/select', selectBid);
router.get('/notifications', getNotifications);

module.exports = router;
