//const Firebird = require('node-firebird');
var firebird = require('node-firebird-dialect1');
const { options } = require('../config');

const clientsService = async () => {
  // Consultamos el procedimiento almacenado "INT_DEUDAS"
  const sql = 'select * from DEUDAS';

  return new Promise((resolve, reject) => {
    firebird.attach(options, function (err, db) {
      if (err) reject({ status: 500, message: err });

      db.query(sql, function (err, result) {
        if (result.length === 0)
          reject({ status: 404, message: 'No se encontraron deudas' });

        // IMPORTANT: close the connection
        db.detach();

        resolve({ status: 200, clients: result }); //Pasamos las deudas al controller
      });
    });
  });
};

module.exports = { clientsService };
