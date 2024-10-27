import Admin from '../models/Admin.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const AdminController = {
  register: async (req, res) => {
    const { name, email, password } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const admin = await Admin.create({ name, email, password: hashedPassword });
      res.status(201).json({ message: 'Admin registered successfully', admin });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  login: async (req, res) => {
    const { email, password } = req.body;
    try {
      const admin = await Admin.findOne({ email });
      if (!admin || !(await bcrypt.compare(password, admin.password))) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
      const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ message: 'Login successful', token });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  dashboard: async (req, res) => {
    try {
      const admin = await Admin.findById(req.user.id);
      res.json({ message: `Welcome to the admin dashboard, ${admin.name}` });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  addInstitution: async (req, res) => {
    try {
      // Logic to add a new institution
      res.json({ message: 'Institution added successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deleteInstitution: async (req, res) => {
    const { id } = req.params;
    try {
      // Logic to delete institution
      res.json({ message: 'Institution deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  logout: (req, res) => {
    res.json({ message: 'Logged out successfully' });
  },
};

export default AdminController;
