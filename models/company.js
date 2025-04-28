const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: String,
  eligibility: String,
  package: String,
  examDate: String,
});

module.exports = mongoose.model('Company', companySchema);
