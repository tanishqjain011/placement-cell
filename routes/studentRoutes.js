const express = require('express');
const router = express.Router();
const Company = require('../models/company');
const Notice = require('../models/notice');  // ⬅️ Import Notice model

// Student Home
router.get('/', async (req, res) => {
  try {
    const companies = await Company.find();
    res.render('student-home', { companies });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading student home page');
  }
});

// ⭐ Student Notices Route
router.get('/notices', async (req, res) => {
  try {
    const notices = await Notice.find();
    res.render('view-notices', { notices });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading notices');
  }
});

module.exports = router;
