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
} = require('../controllers/noteController');

// Secure all note routes to require an authenticated user
router.use(protect);

// Specific routes must be defined before dynamic routes like /:id
router.get('/search', searchNotes);
router.get('/archived/all', getArchivedNotes);
router.get('/filter/tag/:tag', getNotesByTag);
router.get('/filter/category/:category', getNotesByCategory);

router.route('/').post(createNote).get(getNotes);
router.route('/:id').get(getNoteById).patch(updateNote).delete(deleteNote);
router.patch('/archive/:id', toggleArchiveNote);

module.exports = router;
