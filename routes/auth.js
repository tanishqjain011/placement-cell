const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Management = require('../models/management');
const Company = require('../models/company');
const AppliedStudent = require('../models/appliedstudent');

// =================== REDIRECT ROOT ===================
router.get('/', (req, res) => {
  res.redirect('/login');
});

// =================== LOGIN PAGE ===================
router.get('/login', (req, res) => {
  res.render('login');
});

// =================== REGISTER PAGE ===================
router.get('/register', (req, res) => {
  res.render('register');
});

// =================== REGISTER USER ===================
router.post('/register', async (req, res) => {
  const { email, password, role } = req.body;
  try {
    if (role === 'student') {
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.send('Student already exists. Please login.');
      }
      const newUser = new User({ email, password, role });
      await newUser.save();
      console.log('New Student Registered:', newUser);
    } else if (role === 'management') {
      const managerExists = await Management.findOne({ email });
      if (managerExists) {
        return res.send('Management already exists. Please login.');
      }
      const newManager = new Management({ email, password });
      await newManager.save();
      console.log('New Management Registered:', newManager);
    }
    res.redirect('/login');
  } catch (error) {
    console.error('Error while registering:', error);
    res.send('Error registering user.');
  }
});

// =================== LOGIN USER ===================
router.post('/login', async (req, res) => {
  const { email, password, role } = req.body;
  try {
    if (role === 'student') {
      const user = await User.findOne({ email, role: 'student' });
      if (!user || user.password !== password) {
        return res.send('Invalid student credentials.');
      }
      req.session.user = user;
      res.redirect('/student-home');
    } else if (role === 'management') {
      const manager = await Management.findOne({ email });
      if (!manager || manager.password !== password) {
        return res.send('Invalid management credentials.');
      }
      req.session.user = manager;
      res.redirect('/management-home');
    }
  } catch (error) {
    console.error('Error while logging in:', error);
    res.send('Error logging in user.');
  }
});

// =================== STUDENT HOME PAGE ===================
router.get('/student-home', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  try {
    const companies = await Company.find();
    res.render('student-home', { user: req.session.user, companies });
  } catch (error) {
    console.error('Error loading student home:', error);
    res.send('Error loading student home.');
  }
});

// =================== MANAGEMENT HOME PAGE ===================
router.get('/management-home', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  res.render('management-home', { user: req.session.user });
});

// =================== LOGOUT ===================
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) console.error('Error during logout:', err);
    res.redirect('/login');
  });
});

// =================== ADD COMPANY ===================
router.post('/add-company', async (req, res) => {
  const { name, examDate, package, eligibility } = req.body;
  try {
    const newCompany = new Company({ name, examDate, package, eligibility });
    await newCompany.save();
    console.log('Company added:', newCompany);
    res.redirect('/management-home');
  } catch (error) {
    console.error('Error adding company:', error);
    res.send('Error adding company.');
  }
});

// =================== APPLY TO COMPANY (Student) ===================
router.post('/apply/:companyId', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  
  const companyId = req.params.companyId;
  try {
    const company = await Company.findById(companyId);
    if (!company) {
      return res.send('Company not found.');
    }

    // Check already applied
    const alreadyApplied = await AppliedStudent.findOne({
      studentEmail: req.session.user.email,
      companyName: company.name
    });

    if (alreadyApplied) {
      return res.send('You have already applied to ' + company.name);
    }

    // Save application
    const appliedStudent = new AppliedStudent({
      studentEmail: req.session.user.email,
      companyName: company.name,
      appliedAt: new Date()
    });

    await appliedStudent.save();
    console.log('Student Applied:', appliedStudent);

    res.send('Successfully Applied to ' + company.name);
  } catch (error) {
    console.error('Error applying to company:', error);
    res.send('Error while applying.');
  }
});

// =================== VIEW ALL COMPANIES (Management) ===================
router.get('/view-companies', async (req, res) => {
  if (!req.session.user) return res.redirect('/login');

  try {
    const companies = await Company.find();
    res.render('view-companies', { user: req.session.user, companies });
  } catch (error) {
    console.error('Error loading companies:', error);
    res.send('Error loading companies.');
  }
});

// =================== VIEW ALL APPLIED STUDENTS (Management) ===================
router.get('/view-applied-students', async (req, res) => {
  if (!req.session.user) return res.redirect('/login');

  try {
    const appliedStudents = await AppliedStudent.find();
    res.render('view-applied-students', { user: req.session.user, appliedStudents });
  } catch (error) {
    console.error('Error loading applied students:', error);
    res.send('Error loading students.');
  }
});

module.exports = router;
