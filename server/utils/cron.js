const cron = require('node-cron');
const { expression } = require('./sendMessage');

const startCron = () => {
  cron.schedule('* * * * *', expression);
};

module.exports = { startCron };
