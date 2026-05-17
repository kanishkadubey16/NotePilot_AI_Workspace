const mongoose = require('mongoose');

const noteSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      default: '',
      trim: true,
    },
    content: {
      type: String,
      default: '',
    },
    tags: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      default: 'General',
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    shareId: {
      type: String,
      default: '',
    },
    aiSummary: {
      type: String,
      default: '',
    },
    aiActionItems: {
      type: [String],
      default: [],
    },
    lastEdited: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to automatically update lastEdited
noteSchema.pre('save', function () {
  this.lastEdited = Date.now();
});

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;
