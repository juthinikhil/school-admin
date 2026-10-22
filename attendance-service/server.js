const express = require('express');
const app = express();
const PORT = process.env.PORT || 4002;

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'attendance-service', timestamp: new Date().toISOString() });
});

app.get('/attendance/:classId', (req, res) => {
  res.status(200).json({
    classId: req.params.classId,
    date: new Date().toISOString().split('T')[0],
    records: [
      { studentId: 'stu01', status: 'present' },
      { studentId: 'stu02', status: 'excused' }
    ]
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Attendance Service listening on port ${PORT}`);
});
