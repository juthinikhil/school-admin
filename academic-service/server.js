const express = require('express');
const app = express();
const PORT = process.env.PORT || 4001;
app.use(express.json());

let courses = [
  { id: 'cs101', title: 'Intro to Computer Science', teacher: 'Prof. Turing', studentsCount: 35 },
  { id: 'math201', title: 'Calculus II', teacher: 'Dr. Gauss', studentsCount: 28 }
];

let assignments = [
  { id: 'asgn-1', courseId: 'cs101', title: 'Data Structures Lab 3', dueDate: '2026-11-01' },
  { id: 'asgn-2', courseId: 'math201', title: 'Taylor Series Homework', dueDate: '2026-11-05' }
];

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'academic-service' }));
app.get('/courses', (req, res) => res.json({ courses }));
app.post('/courses', (req, res) => {
  const newCourse = { id: `c-${Date.now().toString().slice(-4)}`, ...req.body, studentsCount: 0 };
  courses.push(newCourse);
  res.status(201).json(newCourse);
});
app.get('/assignments', (req, res) => res.json({ assignments }));

app.listen(PORT, '0.0.0.0', () => console.log(`Academic Service on 0.0.0.0:${PORT}`));
