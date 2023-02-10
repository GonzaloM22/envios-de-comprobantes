const cron = require('node-cron');
const { expression } = require('./sendMessage');

const pattern = (data) => {
  if (!data) return '* * * * * *';
  return data;
};

const task = cron.schedule(pattern(), expression, {
  scheduled: false,
});

module.exports = { pattern, task };
