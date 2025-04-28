const express = require('express');
const router = express.Router();
const Company = require('../models/company');
const Notice = require('../models/notice');  // ⬅️ Important
const User = require('../models/user');

// Management Home
router.get('/', (req, res) => {
  res.render('management-home');
});

// POST - Add Company
router.post('/add-company', async (req, res) => {
  const { name, examDate, eligibility, package } = req.body;
  try {
    const newCompany = new Company({
      name,
      examDate,
      eligibilityCriteria: eligibility,
      package
    });
    await newCompany.save();
    res.redirect('/management-home');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error adding company');
  }
});

// POST - ⭐ Add Notice (NEW)
router.post('/add-notice', async (req, res) => {
  const { title, description } = req.body;
  try {
    const newNotice = new Notice({ title, description });
    await newNotice.save();
    res.redirect('/management-home'); // after adding notice, come back to dashboard
  } catch (err) {
    console.error(err);
    res.status(500).send('Error adding notice');
  }
});

module.exports = router;
