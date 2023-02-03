const axios = require('axios');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const pug = require('pug');
const pdf2base64 = require('pdf-to-base64');

const pdfService = async (clients) => {
  const compile = async function (templateName, data) {
    const filePath = path.join(process.cwd(), 'views', `${templateName}.pug`);
    const html = fs.readFileSync(filePath, 'utf-8');
    return pug.compile(html)(data);
  };

  const sendPdf = async (fileName) => {
    //Convertimos el pdf a base 64

    try {
      pdf2base64(fileName).then(async (response) => {
        const file = response;
        let phoneNumber = '543512735687';
        let jsonFile = { file, phoneNumber };

        axios.defaults.headers.common['Authorization'] =
          'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOnsidXVpZCI6IjQ5NTM0NTczNDg5NTczNDg5NzUiLCJpc0FkbWluIjpmYWxzZSwidXNlcklkIjoiQURNSU4ifSwiaWF0IjoxNjc1NDMyNzc1LCJleHAiOjE2NzU1MTkxNzV9.PpYssU0f-OI9dqRAzqbIihZchp01SSJ0ygrEqnPNMS';

        await axios.post(
          `https://pruebaapivanguard.procomisp.com.ar/v5/wpdf`,
          jsonFile
        );
        /*.then((response) => {
              message: response;
            })
            .catch((error) => console.log('error: ', error));*/
      });
    } catch (error) {
      throw error;
    }
  };

  (async () => {
    //Recorremos las deudas y generamos un pdf por cada cliente
    try {
      clients.forEach(async (client) => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        const content = await compile('deudas', client); //Compilamos el template con los datos de la deuda

        await page.setContent(content);
        await page.emulateMediaType('screen');

        //Guardamos el pdf en la ruta path
        await page.pdf({
          path: `${client.RAZONSOCIAL}.pdf`,
          margin: {
            top: '100px',
            right: '50px',
            bottom: '100px',
            left: '50px',
          },
          printBackground: true,
          format: 'A4',
        });

        const fileName = `${client.RAZONSOCIAL}.pdf`;

        //Ejecutamos la funcion de enviar mediante whatsapp
        await sendPdf(fileName);

        await browser.close();
      });
    } catch (error) {
      throw error;
    }
  })();
};

module.exports = { pdfService };
