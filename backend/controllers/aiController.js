const Note = require('../models/Note');
const User = require('../models/User');
const { 
  generateNoteSummary, 
  extractActionItems, 
  generateTitle, 
  suggestTags, 
  improveWriting 
} = require('../services/aiService');

// Helper to reliably track AI usage per user (Dashboard Analytics)
const trackAiUsage = async (userId) => {
  try {
    await User.findByIdAndUpdate(userId, {
      $inc: { aiRequestCount: 1 },
      lastAiUsage: Date.now()
    });
  } catch (error) {
    console.error('Failed to track AI usage:', error);
  }
};

// Helper for strict validation (Empty content, invalid IDs, authorization)
const getValidNote = async (noteId, userId, next) => {
  // Check valid MongoDB ObjectId format to prevent cast errors
  if (!noteId.match(/^[0-9a-fA-F]{24}$/)) {
    res.status(400);
    next(new Error('Invalid note ID format'));
    return null;
  }
  
  const note = await Note.findOne({ _id: noteId, userId });
  if (!note) {
    res.status(404);
    next(new Error('Note not found or user not authorized'));
    return null;
  }
  
  if (!note.content || note.content.trim() === '') {
    res.status(400);
    next(new Error('Note has no content to process'));
    return null;
  }
  
  return note;
};

// @desc    Generate AI Summary for a note
// @route   POST /ai/summary/:noteId
// @access  Private
const generateSummary = async (req, res, next) => {
  try {
    const note = await getValidNote(req.params.noteId, req.user._id, next);
    if (!note) return; // Error already handled by getValidNote

    const summaryText = await generateNoteSummary(note.content);
    note.aiSummary = summaryText;
    note.lastEdited = Date.now();
    await note.save();

    await trackAiUsage(req.user._id);
    res.status(200).json({ success: true, summary: summaryText });
  } catch (error) { 
    next(new Error('AI generation failed. Please try again.')); 
  }
};

// @desc    Extract actionable tasks from note
// @route   POST /ai/action-items/:noteId
// @access  Private
const generateActionItems = async (req, res, next) => {
  try {
    const note = await getValidNote(req.params.noteId, req.user._id, next);
    if (!note) return;

    const actionItems = await extractActionItems(note.content);
    note.aiActionItems = actionItems;
    note.lastEdited = Date.now();
    await note.save();

    await trackAiUsage(req.user._id);
    res.status(200).json({ success: true, actionItems });
  } catch (error) { 
    next(new Error('AI generation failed. Please try again.')); 
  }
};

// @desc    Generate smart professional title
// @route   POST /ai/suggest-title/:noteId
// @access  Private
const suggestTitle = async (req, res, next) => {
  try {
    const note = await getValidNote(req.params.noteId, req.user._id, next);
    if (!note) return;

    const title = await generateTitle(note.content);
    note.title = title;
    note.lastEdited = Date.now();
    await note.save();

    await trackAiUsage(req.user._id);
    res.status(200).json({ success: true, title });
  } catch (error) { 
    next(new Error('AI generation failed. Please try again.')); 
  }
};

// @desc    Generate smart tags from note content
// @route   POST /ai/suggest-tags/:noteId
// @access  Private
const generateTags = async (req, res, next) => {
  try {
    const note = await getValidNote(req.params.noteId, req.user._id, next);
    if (!note) return;

    const tags = await suggestTags(note.content);

    await trackAiUsage(req.user._id);
    res.status(200).json({ success: true, tags });
  } catch (error) { 
    next(new Error('AI generation failed. Please try again.')); 
  }
};

// @desc    Analyze and improve writing quality
// @route   POST /ai/improve-writing/:noteId
// @access  Private
const improveNoteWriting = async (req, res, next) => {
  try {
    const note = await getValidNote(req.params.noteId, req.user._id, next);
    if (!note) return;

    const improvedContent = await improveWriting(note.content);

    await trackAiUsage(req.user._id);
    res.status(200).json({ success: true, suggestions: improvedContent });
  } catch (error) { 
    next(new Error('AI generation failed. Please try again.')); 
  }
};

module.exports = {
  generateSummary,
  generateActionItems,
  suggestTitle,
  generateTags,
  improveNoteWriting
};
