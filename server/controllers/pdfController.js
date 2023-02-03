const { clientsService } = require('../services/clientsService');
const { pdfService } = require('../services/pdfService');

const generatePdf = async (req, res) => {
  //const requestAPI = await axios.get('http://localhost:5008/api/clients');
  //const clients = requestAPI.data.clients;

  try {
    //Traemos todas las deudas de los clientes
    const response = await clientsService();
    const clients = response.clients;

    await pdfService(clients);
    res.send({ error: false });
  } catch (error) {
    res.send({ error: true });
  }
};

module.exports = { generatePdf };
