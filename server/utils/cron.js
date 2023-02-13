const cron = require('node-cron');
const { expression } = require('./sendMessage');

const pattern = (data) => {
  setTimeout(() => {
    console.log(data);
    if (!data) {
      return '* * * * * *';
    }
    return data;
  }, 3000);
};

const task = cron.schedule(pattern(), expression, {
  scheduled: false,
});
module.exports = { pattern, task };
