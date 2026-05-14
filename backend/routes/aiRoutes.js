const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { 
  generateSummary, 
  generateActionItems, 
  suggestTitle, 
  generateTags, 
  improveNoteWriting 
} = require('../controllers/aiController');

// Secure all AI routes
router.use(protect);

router.post('/summary/:noteId', generateSummary);
router.post('/action-items/:noteId', generateActionItems);
router.post('/suggest-title/:noteId', suggestTitle);
router.post('/suggest-tags/:noteId', generateTags);
router.post('/improve-writing/:noteId', improveNoteWriting);

module.exports = router;
