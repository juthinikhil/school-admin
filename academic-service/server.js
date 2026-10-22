const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// In-memory data storage
let courses = [];
let assignments = [];
let grades = [];

// Sample users
let users = [
  { id: 1, username: 'teacher1', password: bcrypt.hashSync('password1', 10), role: 'teacher' },
  { id: 2, username: 'student1', password: bcrypt.hashSync('password2', 10), role: 'student' }
];

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, 'secret', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Course management
app.post('/courses', authenticateToken, (req, res) => {
  if (req.user.role !== 'teacher') return res.sendStatus(403);

  const course = {
    id: uuidv4(),
    name: req.body.name,
    description: req.body.description
  };
  courses.push(course);
  res.status(201).send(course);
});

app.get('/courses', authenticateToken, (req, res) => {
  res.send(courses);
});

// Assignment management
app.post('/assignments', authenticateToken, (req, res) => {
  if (req.user.role !== 'teacher') return res.sendStatus(403);

  const assignment = {
    id: uuidv4(),
    courseId: req.body.courseId,
    name: req.body.name,
    description: req.body.description
  };
  assignments.push(assignment);
  res.status(201).send(assignment);
});

app.get('/assignments', authenticateToken, (req, res) => {
  res.send(assignments);
});

// Grade management
app.post('/grades', authenticateToken, (req, res) => {
  if (req.user.role !== 'teacher') return res.sendStatus(403);

  const grade = {
    id: uuidv4(),
    assignmentId: req.body.assignmentId,
    studentId: req.body.studentId,
    score: req.body.score
  };
  grades.push(grade);
  res.status(201).send(grade);
});

app.get('/grades', authenticateToken, (req, res) => {
  res.send(grades);
});

// User management (for demonstration purposes)
app.post('/login', (req, res) => {
  const user = users.find(u => u.username === req.body.username);
  if (!user) return res.status(401).send('Invalid username or password');

  const validPassword = bcrypt.compareSync(req.body.password, user.password);
  if (!validPassword) return res.status(401).send('Invalid username or password');

  const token = jwt.sign({ id: user.id, role: user.role }, 'secret', { expiresIn: '1h' });
  res.status(200).send({ token });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
