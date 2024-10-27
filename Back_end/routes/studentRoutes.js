import express from 'express';
import StudentController from '../controllers/StudentController.js';

const router = express.Router();

// Student registration
router.post('/register', StudentController.register);

// Student login
router.post('/login', StudentController.login);

// View dashboard
router.get('/dashboard', StudentController.dashboard);

// Apply for courses
router.post('/apply', StudentController.applyForCourse);

// View admissions
router.get('/admissions', StudentController.viewAdmissions);

// Student logout
router.post('/logout', StudentController.logout);

export default router;
