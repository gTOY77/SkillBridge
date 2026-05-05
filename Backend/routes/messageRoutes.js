const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  sendMessage,
  getConversations,
  getMessages,
  archiveConversation,
  deleteConversation
} = require('../controllers/messageController');

router.use(auth); // Protect all routes

router.post('/', sendMessage);
router.get('/conversations', getConversations);
router.get('/:conversationId', getMessages);
router.put('/conversation/:conversationId/archive', archiveConversation);
router.delete('/conversation/:conversationId', deleteConversation);

module.exports = router;
