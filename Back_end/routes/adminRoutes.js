import express from 'express';
import AdminController from '../controllers/AdminController.js';

const router = express.Router();

// Admin registration
router.post('/register', AdminController.register);

// Admin login
router.post('/login', AdminController.login);

// View dashboard
router.get('/dashboard', AdminController.dashboard);

// Institution management
router.post('/institutions', AdminController.addInstitution);
router.delete('/institutions/:id', AdminController.deleteInstitution);

// Faculty management
router.post('/faculties', AdminController.addFaculty);
router.delete('/faculties/:id', AdminController.deleteFaculty);

// Course management
router.post('/courses', AdminController.addCourse);
router.delete('/courses/:id', AdminController.deleteCourse);

// View applications
router.get('/applications', AdminController.viewApplications);

// Admin logout
router.post('/logout', AdminController.logout);

export default router;
