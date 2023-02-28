const axios = require('axios');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const pug = require('pug');
const pdf2base64 = require('pdf-to-base64');
const { updateLastSentDate } = require('../services/rulesService');
const { formatDate } = require('../helpers');

const sendWSP = async (clients, rule) => {
  const compile = async function (templateName, data) {
    const filePath = path.join(process.cwd(), 'views', `${templateName}.pug`);
    const html = fs.readFileSync(filePath, 'utf-8');
    return pug.compile(html)(data);
  };

  const sendPdf = async (fileName, phone) => {
    //Convertimos el pdf a base 64

    try {
      pdf2base64(fileName).then(async (response) => {
        const file = response;
        let phoneNumber = `54${phone}`;
        let jsonFile = { file, phoneNumber };

        const body = {
          username: process.env.USERNAMEAPI,
          password: process.env.PASSWORDAPI,
          deviceinfo: process.env.DEVICEINFO,
        };

        const data = await axios.post(
          `https://pruebaapivanguard.procomisp.com.ar/v5/auth/login`,
          body
        );

        axios.defaults.headers.common[
          'Authorization'
        ] = `Bearer ${data.data.token}`;

        await axios
          .post(`https://pruebaapivanguard.procomisp.com.ar/v5/wpdf`, jsonFile)
          .then((response) => console.log(response.data))
          .catch((error) => console.log(error));
      });
    } catch (error) {
      console.log(error);
    }
  };

  (async () => {
    const execute = async (client) => {
      //Recorremos las deudas y generamos un pdf por cada cliente
      try {
        const browser = await puppeteer.launch({
          args: ['--no-sandbox'],
        });
        const page = await browser.newPage();

        //Convertimos la imagen a base 64
        let img = fs
          .readFileSync(`${process.cwd()}\\/public/img/logoEmpresa.png`)
          .toString('base64');
        img = `data:image/png;base64,${img}`;

        const content = await compile('deudas', {
          client,
          img,
          formatDate,
        }); //Compilamos el template con los datos de la deuda del cliente

        await page.setContent(content, { waitUntil: 'networkidle0' });
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
        await sendPdf(fileName, client[0].TELEFONO);

        //Eliminamos el pdf generado
        fs.unlink(pathName, (err) => {
          if (err) throw err;
        });

        await browser.close();

        await updateLastSentDate(rule.CODIGOREGLA, rule.CODIGOMEDIOENVIO);
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
