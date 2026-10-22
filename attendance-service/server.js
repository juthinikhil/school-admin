const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/attendanceDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define the Attendance model
const AttendanceSchema = new mongoose.Schema({
  classId: String,
  date: String,
  students: [String],
});

const Attendance = mongoose.model('Attendance', AttendanceSchema);

const app = express();
app.use(bodyParser.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('Server is up and running');
});

// Record attendance endpoint
app.post('/attendance', async (req, res) => {
  const { classId, date, students } = req.body;

  try {
    const attendance = new Attendance({ classId, date, students });
    await attendance.save();
    res.status(201).send('Attendance recorded successfully');
  } catch (error) {
    res.status(500).send('Error recording attendance');
  }
});

// Fetch attendance endpoint
app.get('/attendance/:classId/:date', async (req, res) => {
  const { classId, date } = req.params;

  try {
    const attendance = await Attendance.findOne({ classId, date });
    if (!attendance) {
      return res.status(404).send('Attendance not found');
    }
    res.status(200).send(attendance);
  } catch (error) {
    res.status(500).send('Error fetching attendance');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
