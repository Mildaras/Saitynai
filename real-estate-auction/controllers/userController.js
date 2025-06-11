const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Register a new user
exports.registerUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword, role });
    await user.save();

    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// User login function that issues both access and refresh tokens
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate both access and refresh tokens
    const refreshToken = generateRefreshToken(user);
    const accessToken = generateAccessToken(user, refreshToken);

    // Send the tokens back to the client
    res.status(200).json({
      accessToken,
      refreshToken
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Function to generate access token
const generateAccessToken = (user, refresh) => {
  return jwt.sign(
    { userId: user._id, role: user.role, token: refresh },
    process.env.JWT_SECRET,
    { expiresIn: '10m' } // Access token expires in 10 minutes
  );
};

// Function to generate refresh token
const generateRefreshToken = (user) => {
  return jwt.sign(
    { userId: user._id },
    process.env.REFRESH_TOKEN_SECRET, // Separate secret for refresh tokens
    { expiresIn: '2h' } 
  );
};

exports.refreshToken = (req, res) => {
  const { accessToken } = req.body;

  if (!accessToken) {
    return res.status(401).json({ error: 'Access token is required' });
  }

  const refreshToken = jwt.decode(accessToken).token;

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired refresh token' });

    // Generate a new access token
    const newAccessToken = jwt.sign(
      { userId: user.userId, role: user.role, token: refreshToken},
      process.env.JWT_SECRET,
      { expiresIn: '10m' }
    );

    res.status(200).json({ accessToken: newAccessToken });
  });
};

