const cron = require('node-cron');
const { task } = require('./taskCron');

const startCron = () => {
  cron.schedule('* * * * *', task);
};

module.exports = { startCron };
