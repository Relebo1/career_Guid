import Student from '../models/Student.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';

const StudentController = {
  // Register a new student
  register: [
    // Validation rules
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),

    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, password } = req.body;
      try {
        // Check if the email already exists
        const existingStudent = await Student.findOne({ email });
        if (existingStudent) {
          return res.status(409).json({ error: 'Email already registered' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        const student = await Student.create({ name, email, password: hashedPassword });
        res.status(201).json({ message: 'Student registered successfully', student });
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    }
  ],

  // Student login
  login: async (req, res) => {
    const { email, password } = req.body;
    try {
      const student = await Student.findOne({ email });
      if (!student || !(await bcrypt.compare(password, student.password))) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
      const token = jwt.sign({ id: student._id, role: 'student' }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ message: 'Login successful', token });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Access student dashboard
  dashboard: async (req, res) => {
    try {
      const student = await Student.findById(req.user.id);
      res.json({ message: `Welcome to the dashboard, ${student.name}` });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Apply for a course
  applyForCourse: async (req, res) => {
    const { courseId } = req.body;
    try {
      // Logic to apply for a course
      res.json({ message: 'Course application submitted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // View admissions
  viewAdmissions: async (req, res) => {
    try {
      // Logic to retrieve admissions
      res.json({ admissions: [] });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Logout
  logout: (req, res) => {
    res.json({ message: 'Logged out successfully' });
  },
};

export default StudentController;
