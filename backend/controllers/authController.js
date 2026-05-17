const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register new user
// @route   POST /auth/signup
// @access  Public
const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error('Please add all fields');
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    // Create user (password is hashed in User model pre-save middleware)
    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        success: true,
        message: 'Registration successful',
        token: generateToken(user._id),
        user: {
          _id: user.id,
          name: user.name,
          email: user.email,
        },
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate a user
// @route   POST /auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error('Please add email and password');
    }

    // Check for user email
    const user = await User.findOne({ email });

    // matchPassword handles the bcrypt comparison
    if (user && (await user.matchPassword(password))) {
      res.json({
        success: true,
        message: 'Login successful',
        token: generateToken(user._id),
        user: {
          _id: user.id,
          name: user.name,
          email: user.email,
        },
      });
    } else {
      res.status(401);
      throw new Error('Invalid credentials');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get user data
// @route   GET /auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    // req.user is set in the authMiddleware protect function
    res.status(200).json({
      success: true,
      message: 'User details fetched successfully',
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile (name, email, password)
// @route   PUT /auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      return next(new Error('User not found'));
    }

    const { name, email, password } = req.body;

    if (email && email !== user.email) {
      const emailInUse = await User.findOne({ email });
      if (emailInUse) {
        res.status(400);
        return next(new Error('Email already in use'));
      }
    }

    user.name = name || user.name;
    user.email = email || user.email;
    if (password) user.password = password;

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: { _id: updatedUser._id, name: updatedUser.name, email: updatedUser.email },
      token: generateToken(updatedUser._id),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user account and all notes
// @route   DELETE /auth/profile
// @access  Private
const deleteAccount = async (req, res, next) => {
  try {
    const Note = require('../models/Note');
    await Note.deleteMany({ userId: req.user._id });
    await User.findByIdAndDelete(req.user._id);

    res.status(200).json({
      success: true,
      message: 'Account and all notes permanently deleted',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  login,
  getMe,
  updateProfile,
  deleteAccount,
};
