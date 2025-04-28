const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const managementRoutes = require('./routes/managementRoutes');
const studentRoutes = require('./routes/studentRoutes');

dotenv.config();
const app = express();

// Set EJS as template engine
app.set('view engine', 'ejs');

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(session({
  secret: 'placement-secret',
  resave: false,
  saveUninitialized: false,
}));

// MongoDB Connect
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'student'
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Routes
app.use('/', authRoutes);
app.use('/management-home', managementRoutes);
app.use('/student', studentRoutes);   // ✅ Corrected here!

// Server Start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
