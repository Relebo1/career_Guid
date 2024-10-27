import Institution from '../models/Institution.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const InstitutionController = {
  register: async (req, res) => {
    const { name, email, password } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const institution = await Institution.create({ name, email, password: hashedPassword });
      res.status(201).json({ message: 'Institution registered successfully', institution });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  login: async (req, res) => {
    const { email, password } = req.body;
    try {
      const institution = await Institution.findOne({ email });
      if (!institution || !(await bcrypt.compare(password, institution.password))) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
      const token = jwt.sign({ id: institution._id, role: 'institution' }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ message: 'Login successful', token });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  dashboard: async (req, res) => {
    try {
      const institution = await Institution.findById(req.user.id);
      res.json({ message: `Welcome to the dashboard, ${institution.name}` });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  addFaculty: async (req, res) => {
    try {
      // Logic to add faculty
      res.json({ message: 'Faculty added successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  addCourse: async (req, res) => {
    try {
      // Logic to add course
      res.json({ message: 'Course added successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  viewApplications: async (req, res) => {
    try {
      // Logic to retrieve applications
      res.json({ applications: [] });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  logout: (req, res) => {
    res.json({ message: 'Logged out successfully' });
  },
};

export default InstitutionController;
