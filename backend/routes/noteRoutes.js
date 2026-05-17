const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
  toggleArchiveNote,
  searchNotes,
  getNotesByTag,
  getNotesByCategory,
  getArchivedNotes,
  toggleShareNote,
  getPublicNote,
} = require('../controllers/noteController');

// 1. PUBLIC ROUTES (No authentication required)
router.get('/shared/:shareId', getPublicNote);

// 2. PROTECTED ROUTES (Require authentication)
router.use(protect);

router.get('/search', searchNotes);
router.get('/archived/all', getArchivedNotes);
router.get('/filter/tag/:tag', getNotesByTag);
router.get('/filter/category/:category', getNotesByCategory);

router.route('/').post(createNote).get(getNotes);
router.route('/:id').get(getNoteById).patch(updateNote).delete(deleteNote);
router.patch('/archive/:id', toggleArchiveNote);
router.patch('/share/:id', toggleShareNote);

module.exports = router;
