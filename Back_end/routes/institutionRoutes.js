import express from 'express';
import InstitutionController from '../controllers/InstitutionController.js';

const router = express.Router();

// Institution registration
router.post('/register', InstitutionController.register);

// Institution login
router.post('/login', InstitutionController.login);

// View dashboard
router.get('/dashboard', InstitutionController.dashboard);

// Faculty management by institution
router.post('/faculties', InstitutionController.addFaculty);
router.delete('/faculties/:id', InstitutionController.deleteFaculty);

// Course management by institution
router.post('/courses', InstitutionController.addCourse);
router.get('/courses', InstitutionController.getCourses);  // to retrieve courses for institution dashboard

// Application management
router.get('/applications', InstitutionController.viewApplications);
router.post('/updateAdmission/:id', InstitutionController.updateAdmissionStatus);

// Institution logout
router.post('/logout', InstitutionController.logout);

export default router;
