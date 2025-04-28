const mongoose = require('mongoose');

const appliedStudentSchema = new mongoose.Schema({
  studentEmail: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
});

const AppliedStudent = mongoose.model('AppliedStudent', appliedStudentSchema);

module.exports = AppliedStudent;
