const { pattern, task } = require('../utils/cron');

const generatePdf = async (days, activo) => {
  let time;
  if (days === 0) {
    time = '* * * * * *';
  } else {
    const hour = new Date().getHours();
    const minutes = new Date().getMinutes() + 1;

    time = `0 ${minutes} ${hour} */${days} * *`; //Se ejecuta cada X días
  }

  if (activo === 1) {
    pattern(time);
    task.start();
  } else {
    task.stop();
  }
};
module.exports = { generatePdf };
