const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
    },
    aiRequestCount: {
      type: Number,
      default: 0,
    },
    lastAiUsage: {
      type: Date,
    },
    aiUsageBreakdown: {
      summary: { type: Number, default: 0 },
      'action-items': { type: Number, default: 0 },
      title: { type: Number, default: 0 },
      tags: { type: Number, default: 0 },
      improve: { type: Number, default: 0 },
    },
  },
  {
    // This automatically creates createdAt and updatedAt fields
    timestamps: true,
  }
);

// Encrypt password using bcrypt before saving
userSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Helper method to compare entered password with the hashed password in the database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
