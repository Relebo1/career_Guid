import express from 'express';
import cors from 'cors';
import sequelize from './config/database.js';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Student from './models/Student.js';
import Course from './models/Course.js';
import Faculty from './models/Faculty.js';
import Admin from './models/Admin.js';
import Institution from './models/Institution.js';
import Application from './models/Application.js';

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'your_jwt_secret';

// Enable CORS
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
app.use(express.json());

// Database connection
sequelize.authenticate()
  .then(() => {
    console.log('Database connected...');
    return sequelize.sync({ alter: true });
  })
  .then(() => console.log('Database synchronized.'))
  .catch(error => console.error('Database connection error:', error));

// Registration Routes
const registerUser = async (model, req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await model.create({ name, email, password: hashedPassword });
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(400).json({ error: 'Error registering user.' });
  }
};

app.post('/api/students/register', (req, res) => registerUser(Student, req, res));
app.post('/api/admin/register', (req, res) => registerUser(Admin, req, res));
app.post('/api/institution/register', (req, res) => registerUser(Institution, req, res));

// Login Routes
const loginUser = async (model, req, res, role) => {
  const { email, password } = req.body;
  try {
    const user = await model.findOne({ where: { email } });
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ id: user.id, role }, JWT_SECRET, { expiresIn: '1h' });
      return res.status(200).json({ message: 'Login successful', token });
    }
    return res.status(401).json({ error: 'Invalid credentials' });
  } catch (error) {
    console.error(`Error logging in ${role}:`, error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

app.post('/api/student/login', (req, res) => loginUser(Student, req, res, 'student'));
app.post('/api/admin/login', (req, res) => loginUser(Admin, req, res, 'admin'));
app.post('/api/institution/login', (req, res) => loginUser(Institution, req, res, 'institution'));

// Middleware for JWT Authentication
const authenticateJWT = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (token) {
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

// Protected Routes
app.get('/api/student', authenticateJWT, (req, res) => {
  if (req.user.role !== 'student') return res.sendStatus(403);
  res.status(200).json({ message: 'Welcome Student!' });
});

app.get('/api/admin', authenticateJWT, (req, res) => {
  if (req.user.role !== 'admin') return res.sendStatus(403);
  res.status(200).json({ message: 'Welcome Admin!' });
});

app.get('/api/institution', authenticateJWT, (req, res) => {
  if (req.user.role !== 'institution') return res.sendStatus(403);
  res.status(200).json({ message: 'Welcome Institution!' });
});

// Faculty Routes
app.post('/api/faculties', async (req, res) => {
  const { name } = req.body;
  try {
    const newFaculty = await Faculty.create({ name });
    res.status(200).json(newFaculty);
  } catch (error) {
    console.error('Error registering Faculty:', error);
    res.status(400).json({ error: 'Error registering Faculty.' });
  }
});

app.get('/api/faculties', async (req, res) => {
  try {
    const faculties = await Faculty.findAll();
    res.status(200).json(faculties);
  } catch (error) {
    console.error('Error fetching Faculty:', error);
    res.status(400).json({ error: 'Error fetching Faculty.' });
  }
});

app.delete('/api/faculties/:id', async (req, res) => {
  try {
    const result = await Faculty.destroy({ where: { id: req.params.id } });
    if (!result) return res.status(404).json({ Message: "Faculty Not Found" });
    res.status(200).json({ Message: 'Deleted Successfully' });
  } catch (error) {
    console.error('Error deleting Faculty:', error);
    res.status(400).json({ error: 'Error deleting Faculty.' });
  }
});

// Course Routes
app.post('/api/courses', async (req, res) => {
  const { name, facultyId } = req.body;
  try {
    if (!name || !facultyId) return res.status(400).json({ error: 'Course name and faculty ID are required.' });
    const newCourse = await Course.create({ name, facultyId });
    res.status(201).json(newCourse);
  } catch (error) {
    console.error('Error registering course:', error);
    res.status(400).json({ error: 'Error registering course.' });
  }
});

app.get('/api/courses', async (req, res) => {
  try {
    const courses = await Course.findAll();
    res.status(200).json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(400).json({ error: 'Error fetching courses.' });
  }
});


app.get('/api/applications', async (req, res) => {
  try {
    const courses = await Application.findAll();
    res.status(200).json(courses);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(400).json({ error: 'Error fetching applications.' });
  }
});

app.get('/api/courses/:facultyId', async (req, res) => {
  try {
    const courses = await Course.findAll({ where: { facultyId: req.params.facultyId } });
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Error fetching courses.' });
  }
});



app.delete('/api/courses/:id', async (req, res) => {
  try {
    const result = await Course.destroy({ where: { id: req.params.id } });
    if (!result) return res.status(404).json({ Message: "Course Not Found" });
    res.status(200).json({ Message: 'Deleted Successfully' });
  } catch (error) {
    console.error('Error deleting Course:', error);
    res.status(400).json({ error: 'Error deleting Course.' });
  }
});

// Application Route
app.post('/api/apply', async (req, res) => {
  const { student_id, course_id } = req.body;
  try {
    if (!student_id || !course_id) return res.status(400).json({ message: "student_id and course_id are required." });
    const application = await Application.create({ student_id, course_id });
    res.status(201).json(application);
  } catch (error) {
    console.error("Error creating application:", error);
    res.status(500).json({ message: "An error occurred while creating the application." });
  }
});

// Logout Route
app.post('/api/logout', (req, res) => res.status(200).json({ message: 'Logout successful' }));

// Start Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
