// Example model

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PeriodSchema = new Schema({
  start: String,
  end: String,
  type: String,
  notes: String
});

PeriodSchema.virtual('date')
  .get(() => this._id.getTimestamp());

mongoose.model('Period', PeriodSchema);
