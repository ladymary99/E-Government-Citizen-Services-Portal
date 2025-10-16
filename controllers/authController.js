const { User, Department } = require("../models");
const { generateToken } = require("../middleware/auth");

// Register new user
const register = async (req, res, next) => {
  try {
    const userData = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      where: { email: userData.email },
    });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Check national ID for citizens
    if (userData.role === "citizen" && userData.nationalId) {
      const existingNationalId = await User.findOne({
        where: { nationalId: userData.nationalId },
      });
      if (existingNationalId) {
        return res.status(400).json({
          success: false,
          message: "User with this National ID already exists",
        });
      }
    }

    // Create user
    const user = await User.create(userData);

    // Generate token
    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Login user
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user with password
    const user = await User.findOne({
      where: { email },
      include: [{ model: Department, as: "department" }],
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Account is deactivated. Please contact support.",
      });
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate token
    const token = generateToken(user.id);

    // Remove password from response
    const userResponse = user.toJSON();

    res.json({
      success: true,
      message: "Login successful",
      data: {
        user: userResponse,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get current user profile
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [{ model: Department, as: "department" }],
      attributes: { exclude: ["password"] },
    });

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Update profile
const updateProfile = async (req, res, next) => {
  try {
    const { id } = req.user;
    const updates = req.body;

    // Prevent updating sensitive fields
    delete updates.password;
    delete updates.role;
    delete updates.email;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await user.update(updates);

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Change password
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const { id } = req.user;

    const user = await User.findByPk(id);

    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
};
