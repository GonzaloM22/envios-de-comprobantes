//const Firebird = require('node-firebird');
var firebird = require('node-firebird-dialect1');
const { options } = require('../config');

const invoiceService = async () => {
  // Consultamos el procedimiento almacenado "INT_DEUDAS"
  const sql = 'select * from INT_FACTURAS';

  return new Promise((resolve, reject) => {
    firebird.attach(options, function (err, db) {
      if (err) reject({ status: 500, message: err });

      db.query(sql, function (err, result) {
        if (result.length === 0)
          reject({ status: 404, message: 'No se encontraron comprobantes' });

        // IMPORTANT: close the connection
        db.detach();

        resolve({ status: 200, invoices: result }); //Pasamos las deudas al controller
      });
    });
  });
};

module.exports = { invoiceService };
