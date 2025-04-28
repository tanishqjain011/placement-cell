const Notice = require('../models/notice'); // New model

// Management - Notice page
router.get('/management-home/notice', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  res.render('management-add-notice');
});

// Add a new notice
router.post('/add-notice', async (req, res) => {
  const { noticeText } = req.body;
  try {
    const newNotice = new Notice({ noticeText });
    await newNotice.save();
    console.log('New Notice Added:', newNotice);
    res.redirect('/management-home');
  } catch (error) {
    console.error('Error adding notice:', error);
    res.send('Error adding notice.');
  }
});

// Student - View notices
router.get('/view-notices', async (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.render('view-notices', { notices });
  } catch (error) {
    console.error('Error loading notices:', error);
    res.send('Error loading notices.');
  }
});
