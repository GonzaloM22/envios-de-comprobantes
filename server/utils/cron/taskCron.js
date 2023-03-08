const { clientsService } = require('../../services/clientsService');
const { invoiceService } = require('../../services/invoiceService');
const { sendWSP } = require('../sendWSP');
const { sendEmail } = require('../sendEmail');
const { getRulesService } = require('../../services/rulesService');
const { getConfigsService } = require('../../services/configService');

const task = async () => {
  try {
    const response = await getRulesService(); //Consultamos las reglas creadas para recorrerlas

    response.rules.forEach(async (rule) => {
      //Envio por Whatsapp
      if (
        rule.ACTIVO === 1 &&
        rule.CODIGOMEDIOENVIO === 1 &&
        rule.CANTIDADDIAS > rule.RECORDATORIO
      ) {
        switch (rule.CODIGOTIPOENVIO) {
          case 1: //Deudas Totales
            const response = await clientsService(); //Traemos todas las deudas de los clientes
            const clients = response.clients;
            await sendWSP(clients, rule);

            break;
          case 2: //Facturas
            const responseInvoices = await invoiceService(); //Traemos todas las deudas de los clientes
            const invoices = responseInvoices.invoices;
            await sendWSP(invoices, rule);

            break;
          default:
            break;
        }
      }
      //Envio por Email
      if (
        rule.ACTIVO === 1 &&
        rule.CODIGOMEDIOENVIO === 2 &&
        rule.CANTIDADDIAS > rule.RECORDATORIO
      ) {
        const config = await getConfigsService(); //Traemos las configuraciones del Email
        const configEmail = config.configs.filter(
          (value) => value.CODIGOMEDIOENVIO === 2
        );

        switch (rule.CODIGOTIPOENVIO) {
          case 1: //Deudas Totales
            const response = await clientsService(); //Traemos todas las deudas de los clientes
            const clients = response.clients;
            await sendEmail(clients, configEmail[0], rule);
            break;
          case 2: //Facturas
            const responseInvoices = await invoiceService(); //Traemos todas las deudas de los clientes
            const invoices = responseInvoices.invoices;
            await sendEmail(invoices, configEmail[0], rule);

            break;
          default:
            break;
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { task };
