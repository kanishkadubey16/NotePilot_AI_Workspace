const Note = require('../models/Note');

// @desc    Create a new note
// @route   POST /notes
// @access  Private
const createNote = async (req, res, next) => {
  try {
    const { title, content, tags, category } = req.body;
    const note = new Note({
      userId: req.user._id,
      title: title || '',
      content: content || '',
      tags: tags || [],
      category: category || 'General',
    });

    const savedNote = await note.save();

    res.status(201).json({
      success: true,
      message: 'Note created successfully',
      note: savedNote,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all notes for logged-in user
// @route   GET /notes
// @access  Private
const getNotes = async (req, res, next) => {
  try {
    const notes = await Note.find({
      userId: req.user._id
    }).sort({ lastEdited: -1 });

    res.status(200).json({
      success: true,
      message: 'Notes fetched successfully',
      count: notes.length,
      notes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single note
// @route   GET /notes/:id
// @access  Private
const getNoteById = async (req, res, next) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, userId: req.user._id });

    if (!note) {
      res.status(404);
      return next(new Error('Note not found or user not authorized'));
    }

    res.status(200).json({
      success: true,
      message: 'Note fetched successfully',
      note,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update note (Optimized for frontend auto-save)
// @route   PATCH /notes/:id
// @access  Private
const updateNote = async (req, res, next) => {
  try {
    const { title, content, tags, category, isArchived, isPublic, shareId, aiSummary, aiActionItems } = req.body;

    const updateData = { lastEdited: Date.now() };
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (tags !== undefined) updateData.tags = tags;
    if (category !== undefined) updateData.category = category;
    if (isArchived !== undefined) updateData.isArchived = isArchived;
    if (isPublic !== undefined) updateData.isPublic = isPublic;
    if (shareId !== undefined) updateData.shareId = shareId;
    if (aiSummary !== undefined) updateData.aiSummary = aiSummary;
    if (aiActionItems !== undefined) updateData.aiActionItems = aiActionItems;

    // findOneAndUpdate is significantly faster than findById + save() for auto-saves
    const updatedNote = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedNote) {
      res.status(404);
      return next(new Error('Note not found or user not authorized to modify'));
    }

    res.status(200).json({
      success: true,
      message: 'Note updated successfully',
      note: updatedNote,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete note permanently
// @route   DELETE /notes/:id
// @access  Private
const deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

    if (!note) {
      res.status(404);
      return next(new Error('Note not found or user not authorized'));
    }

    res.status(200).json({
      success: true,
      message: 'Note removed successfully',
      id: req.params.id,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Archive/unarchive note
// @route   PATCH /notes/archive/:id
// @access  Private
const toggleArchiveNote = async (req, res, next) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, userId: req.user._id });

    if (!note) {
      res.status(404);
      return next(new Error('Note not found or user not authorized'));
    }

    note.isArchived = !note.isArchived;
    note.lastEdited = Date.now();
    const updatedNote = await note.save();

    res.status(200).json({
      success: true,
      message: `Note ${updatedNote.isArchived ? 'archived' : 'unarchived'} successfully`,
      note: updatedNote,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search notes by query string
// @route   GET /notes/search
// @access  Private
const searchNotes = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(200).json({ success: true, count: 0, notes: [] });
    }

    const notes = await Note.find({
      userId: req.user._id,
      isArchived: false,
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } },
      ],
    }).sort({ lastEdited: -1 });

    res.status(200).json({
      success: true,
      message: 'Search results fetched successfully',
      count: notes.length,
      notes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Filter notes by tag
// @route   GET /notes/filter/tag/:tag
// @access  Private
const getNotesByTag = async (req, res, next) => {
  try {
    const notes = await Note.find({
      userId: req.user._id,
      isArchived: false,
      tags: { $in: [req.params.tag] },
    }).sort({ lastEdited: -1 });

    res.status(200).json({
      success: true,
      message: `Notes filtered by tag: ${req.params.tag}`,
      count: notes.length,
      notes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Filter notes by category
// @route   GET /notes/filter/category/:category
// @access  Private
const getNotesByCategory = async (req, res, next) => {
  try {
    const notes = await Note.find({
      userId: req.user._id,
      isArchived: false,
      category: req.params.category,
    }).sort({ lastEdited: -1 });

    res.status(200).json({
      success: true,
      message: `Notes filtered by category: ${req.params.category}`,
      count: notes.length,
      notes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all archived notes
// @route   GET /notes/archived/all
// @access  Private
const getArchivedNotes = async (req, res, next) => {
  try {
    const notes = await Note.find({
      userId: req.user._id,
      isArchived: true,
    }).sort({ lastEdited: -1 });

    res.status(200).json({
      success: true,
      message: 'Archived notes fetched successfully',
      count: notes.length,
      notes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle or set public share status
// @route   PATCH /notes/share/:id
// @access  Private
const toggleShareNote = async (req, res, next) => {
  try {
    const { nanoid } = await import('nanoid');
    const note = await Note.findOne({ _id: req.params.id, userId: req.user._id });

    if (!note) {
      res.status(404);
      return next(new Error('Note not found or user not authorized'));
    }

    if (req.body && typeof req.body.isPublic === 'boolean') {
      note.isPublic = req.body.isPublic;
    } else {
      note.isPublic = !note.isPublic;
    }

    if (note.isPublic && !note.shareId) {
      note.shareId = nanoid(10);
    }
    
    note.lastEdited = Date.now();
    const updatedNote = await note.save();

    res.status(200).json({
      success: true,
      message: `Note ${updatedNote.isPublic ? 'shared' : 'made private'} successfully`,
      note: updatedNote,
      shareUrl: updatedNote.isPublic ? `/shared/${updatedNote.shareId}` : null
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get public note by shareId
// @route   GET /notes/shared/:shareId
// @access  Public
const getPublicNote = async (req, res, next) => {
  try {
    const note = await Note.findOne({ shareId: req.params.shareId, isPublic: true });

    if (!note) {
      res.status(404);
      return next(new Error('Shared note not found or no longer public'));
    }

    res.status(200).json({
      success: true,
      note: {
        title: note.title,
        content: note.content,
        tags: note.tags,
        category: note.category,
        aiSummary: note.aiSummary,
        aiActionItems: note.aiActionItems,
        updatedAt: note.updatedAt
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
};
