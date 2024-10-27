const User = require('../models/User'); // Import your User model

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const newUser = await User.create({ name, email, password });
    res.status(201).json({ message: 'User registered', user: newUser });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
};

exports.login = async (req, res) => {
  // Logic for login
};
