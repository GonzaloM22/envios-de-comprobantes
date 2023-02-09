const { clientsService } = require('../services/clientsService');
const { pdfService } = require('../services/pdfService');
const cron = require('node-cron');

const generatePdf = (days) => {
  let time;
  if (days === 0) {
    time = '* * * * *';
  } else {
    time = `0 0 12 */${days} * * *`; //Se ejecuta cada X días a las 12 pm
  }

  cron.schedule(time, async () => {
    try {
      //Traemos todas las deudas de los clientes
      const response = await clientsService();

      const clients = response.clients;

      await pdfService(clients);
      res.send({ error: false });
    } catch (error) {
      res.send({ error: true });
    }
  });
};

module.exports = { generatePdf };
