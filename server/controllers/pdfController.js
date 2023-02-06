const { clientsService } = require('../services/clientsService');
const { pdfService } = require('../services/pdfService');
const cron = require('node-cron');

const generatePdf = (req, res) => {
  //const requestAPI = await axios.get('http://localhost:5008/api/clients');
  //const clients = requestAPI.data.clients;

  //0 0 12 1/30 * * * CADA 30 DIAS A LAS 12 PM
  cron.schedule('* * * * *', async () => {
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
