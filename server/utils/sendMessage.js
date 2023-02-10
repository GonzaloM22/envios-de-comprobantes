const { clientsService } = require('../services/clientsService');
const { pdfService } = require('../services/pdfService');

const expression = async () => {
  try {
    const response = await clientsService(); //Traemos todas las deudas de los clientes
    const clients = response.clients;
    await pdfService(clients);

    res.send({ error: false });
  } catch (error) {
    res.send({ error: true });
  }
};

module.exports = { expression };
