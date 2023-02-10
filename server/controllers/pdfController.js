const { pattern, task } = require('../utils/cron');

const generatePdf = async (days, activo) => {
  let time;
  if (days === 0) {
    time = '* * * * * *';
  } else {
    time = `0 0 12 */${days} * * *`; //Se ejecuta cada X días a las 12 pm
  }

  if (activo === 1) {
    pattern(time);
    task.start();
  } else {
    task.stop();
  }
};
module.exports = { generatePdf };
