const nodemailer = require('nodemailer');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const pug = require('pug');
const { updateLastSentDate } = require('../services/rulesService');

// async..await is not allowed in global scope, must use a wrapper
const sendEmail = async (clients, config, rule) => {
  const { EMAILREMITENTE, PASSWORD1, SERVIDORSMTP, PUERTO } = config || {};

  const compile = async function (templateName, data) {
    const filePath = path.join(process.cwd(), 'views', `${templateName}.pug`);
    const html = fs.readFileSync(filePath);
    return pug.compile(html)(data);
  };

  const sendPDF = async (fileName) => {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: SERVIDORSMTP,
      port: PUERTO,
      secure: PUERTO === 465 ? true : false, // true for 465, false for other ports
      auth: {
        user: EMAILREMITENTE, // generated ethereal user
        pass: PASSWORD1, // generated ethereal password
      },
    });

    // send mail with defined transport object
    try {
      await transporter.sendMail({
        from: 'Flexxus Enterprise', // sender address
        to: 'gonn.m@hotmail.com', // list of receivers
        subject: 'Saldo de Cuenta Corriente', // Subject line
        text: 'Cuenta Corriente', // plain text body
        html: '<p>Saldo pendiente en cuenta corriente.</p>', // html body
        attachments: [{ filename: fileName, path: `./${fileName}` }],
      });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }

    //sendEmail().catch(console.error);
  };

  (async () => {
    //Recorremos las deudas y generamos un pdf por cada cliente
    try {
      return clients?.forEach(async (client) => {
        const browser = await puppeteer.launch({
          args: ['--no-sandbox'],
        });
        const page = await browser.newPage();

        //Convertimos la imagen a base 64
        let img = fs
          .readFileSync(`${process.cwd()}\\/public/img/logoEmpresa.png`)
          .toString('base64');
        img = `data:image/png;base64,${img}`;

        client = { ...client, img };

        const content = await compile('deudas', client); //Compilamos el template con los datos de la deuda del cliente

        await page.setContent(content, { waitUntil: 'networkidle0' });
        await page.emulateMediaType('print');

        //Guardamos el pdf en la ruta pathName
        const pathName = `${client.RAZONSOCIAL} - ${Date.now()}.pdf`;

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

        //Ejecutamos la funcion de enviar mediante Email
        const sent = await sendPDF(fileName);

        //Eliminamos el pdf generado
        fs.unlink(pathName, (err) => {
          if (err) throw err;
        });

        await browser.close();

        //Actualizamos fecha de ultimo envio en la base de datos
        if (sent)
          await updateLastSentDate(rule.CODIGOREGLA, rule.CODIGOMEDIOENVIO);
      });
    } catch (error) {
      throw false;
    }
  })();
};

module.exports = { sendEmail };
