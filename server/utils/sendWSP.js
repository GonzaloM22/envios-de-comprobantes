const axios = require('axios');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const pug = require('pug');
const pdf2base64 = require('pdf-to-base64');
const { updateLastSentDate } = require('../services/rulesService');
const { formatDate } = require('../helpers');
const { generateQR } = require('./qrAfip');
const { whatsappService } = require('../services/whatsappService');
const { newSent } = require('../services/pdfSentService');

const sendWSP = async (clients, rule) => {
  const compile = async function (templateName, data) {
    const filePath = path.join(process.cwd(), 'views', `${templateName}.pug`);
    const html = fs.readFileSync(filePath, 'utf-8');
    return pug.compile(html)(data);
  };

  const sendPdf = async (fileName, phone) => {
    try {
      //Convertimos el pdf a base 64
      return pdf2base64(fileName).then(async (response) => {
        const file = response;
        let phoneNumber = `54${phone}`;
        let jsonFile = { file, phoneNumber };

        return await whatsappService(jsonFile);
      });
    } catch (error) {
      console.log(error);
    }
    return sent;
  };

  (async () => {
    const execute = async (client) => {
      //Recorremos las deudas y generamos un pdf por cada cliente
      try {
        const browser = await puppeteer.launch({
          args: ['--no-sandbox'],
        });
        const page = await browser.newPage();

        //Convertimos el logo a base 64
        let img = fs
          .readFileSync(`${process.cwd()}\\/public/img/logoEmpresa.png`)
          .toString('base64');
        img = `data:image/png;base64,${img}`;

        let totalcomprobantes = 0;
        client.forEach(
          (element) => (totalcomprobantes = totalcomprobantes + element.SALDO)
        );
        client[0] = { ...client[0], totalcomprobantes };

        if (client[0].NUMEROCAE) {
          const qrCode = await generateQR(client);
          const content = await compile('factura', {
            //Compilamos el template con los datos de la factura del cliente
            client,
            img,
            qrCode,
            formatDate,
          });
          await page.setContent(content, { waitUntil: 'networkidle0' });
        } else {
          let totalcomprobantes = 0;
          client.forEach(
            (c) => (totalcomprobantes = totalcomprobantes + c.TOTAL - c.PAGADO)
          );

          const content = await compile('deudas', {
            client,
            totalcomprobantes,
            img,
            formatDate,
          }); //Compilamos el template con los datos de la deuda del cliente
          await page.setContent(content, { waitUntil: 'networkidle0' });
        }

        await page.emulateMediaType('print');

        //Guardamos el pdf en la ruta pathName
        const pathName = `${client[0].RAZONSOCIAL} - ${Date.now()}.pdf`;
        await page.addStyleTag({ path: 'public/css/app.css' });
        await page.pdf({
          path: pathName,
          margin: {
            top: '100px',
            right: '50px',
            bottom: '100px',
            left: '50px',
          },
          printBackground: true,
          format: 'A4',
        });

        const fileName = pathName;

        //Ejecutamos la funcion de enviar mediante whatsapp
        const sent = await sendPdf(fileName, client[0].TELEFONO);

        //Eliminamos el pdf generado
        fs.unlink(pathName, (err) => {
          if (err) throw err;
        });

        await browser.close();

        //Actualizamos la fecha de ultimo envio
        await updateLastSentDate(rule.CODIGOREGLA, rule.CODIGOMEDIOENVIO);

        //Guardamos registro de lo enviado
        await newSent(rule);
      } catch (error) {
        console.log(error);
      }
    };

    let client = [];
    for (let i = 0; i < clients?.length; i++) {
      if (
        clients[i].CODIGOPARTICULAR == client[0]?.CODIGOPARTICULAR ||
        i === 0
      ) {
        client.push(clients[i]);
      } else {
        await execute(client);
        client = [];
        client.push(clients[i]);
      }
    }
    await execute(client);
  })();
};

module.exports = { sendWSP };
