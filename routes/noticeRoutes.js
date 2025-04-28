// routes/noticeRoutes.js
const express = require('express');
const Notice = require('../models/notice');
const router = express.Router();

// Route to add a new notice (for management)
router.post('/add', async (req, res) => {
  try {
    const { title, description } = req.body;

    // Create a new notice document
    const newNotice = new Notice({ title, description });

    // Save the notice to the database
    await newNotice.save();
    res.redirect('/admin');  // Redirect to the management page (you can change this)
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Route to get all notices (for the student home page)
router.get('/notices', async (req, res) => {
  try {
    const notices = await Notice.find().sort({ date: -1 });  // Sort notices by date
    res.render('student-home', { notices });  // Pass notices to the student home page
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

module.exports = router;
