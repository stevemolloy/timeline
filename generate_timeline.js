const config = require('./config/config');
const glob = require('glob');
const mongoose = require('mongoose');
const moment = require('moment');
const async = require('async');
const currentWeekNumber = require('current-week-number');

const models = glob.sync(config.root + '/app/models/*.js');
models.forEach(function(model) {
  require(model);
});
const Period = mongoose.model('Period');

const runStart = '2018-12-31 00:00:00';
const runEnd = '2019-12-31 00:00:00';
var periods = [];
var d = moment(runStart);
while (d < moment(runEnd)) {
  periods.push([d.format(), d.add(1, 'week').format()]);
}

mongoose.Promise = Promise;
mongoose.connect(config.db);
const db = mongoose.connection;
db.on('error', () => {
  throw new Error('unable to connect to database');
});
db.on('open', () => {
  console.log('DB open');
  async.each(
    periods,
    function(period, next) {
      var start = moment(period[0]).add(1, 'second');
      var type = typeOfWeek(start);
      if (type === 'delivery') {
        Period({
          start: start.toDate(),
          end: start.add(31, 'hours').add(-1, 'seconds').toDate(),
          type: 'delivery',
          notes: ''
        }).save((err) => {
          Period({
            start: start.add(1, 'seconds').toDate(),
            end: start.add(26, 'hours').add(-1, 'seconds').toDate(),
            type: 'maintenance',
            notes: ''
          }).save((err) => {
            Period({
              start: start.add(1, 'seconds').toDate(),
              end: moment(period[1]).toDate(),
              type: 'delivery',
              notes: ''
            }).save((err) => {
              next(err);
            });
          });
        });
      } else {
        Period({
          start: start,
          end: moment(period[1]),
          type: typeOfWeek(start),
          notes: ''
        }).save((err) => {
          next(err);
        });
      }
    },
    function(err) {
      db.close();
      console.log('FINISHED!');
    });
});

function typeOfWeek(date) {
  const weekNumber = currentWeekNumber(date.toDate());
  const startupWeeks = [1, 2, 36, 37];
  const commissioningWeeks = [7, 11, 17, 20, 42, 47];
  const shutdownWeeks = [27, 28, 29, 30, 31, 32, 33, 34, 35];
  if (startupWeeks.includes(weekNumber)) return 'startup';
  if (commissioningWeeks.includes(weekNumber)) return 'commissioning';
  if (startupWeeks.includes(weekNumber)) return 'startup';
  return 'delivery';
}
