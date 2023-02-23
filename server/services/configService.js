//const Firebird = require('node-firebird');
var firebird = require('node-firebird-dialect1');
const { options } = require('../config');

const newConfigService = async (data) => {
  let {
    codigomedioenvio,
    emailremitente,
    password,
    servidorsmtp,
    puerto,
    numero,
  } = data;

  emailremitente = !emailremitente ? null : `'${emailremitente}'`;
  password = !password ? null : `'${password}'`;
  servidorsmtp = !servidorsmtp ? null : `'${servidorsmtp}'`;

  const sql = `insert into INT_PARAMETRIZACIONENVIOS (CODIGOPARAMETRIZACION, CODIGOMEDIOENVIO, EMAILREMITENTE, PASSWORD1, SERVIDORSMTP, PUERTO, TELEFONO)
  values (gen_id(GEN_INT_PARAMETRIZACIONENVIOS_I, 1),${codigomedioenvio}, ${emailremitente},${password}, ${servidorsmtp}, ${puerto}, ${numero})`;

  return new Promise((resolve, reject) => {
    firebird.attach(options, function (err, db) {
      if (err) reject({ status: 500, msg: err });

      db.query(sql, function (err, result) {
        if (err) reject({ status: 500, msg: err });

        // IMPORTANT: close the connection
        db.detach();

        resolve({
          status: 200,
          message: false,
          data: data,
        });
      });
    });
  });
};

const getConfigsService = async () => {
  const sql = 'select * from INT_PARAMETRIZACIONENVIOS';

  return new Promise((resolve, reject) => {
    firebird.attach(options, function (err, db) {
      if (err) reject({ status: 500, msg: err });

      db.query(sql, function (err, result) {
        if (err) reject({ status: 500, msg: err });

        // IMPORTANT: close the connection
        db.detach();

        resolve({
          status: 200,
          message: false,
          configs: result,
        });
      });
    });
  });
};

const updateConfigService = async (config) => {
  const {
    codigoparametrizacion,
    emailremitente,
    password,
    servidorsmtp,
    puerto,
    codigomedioenvio,
    numero,
  } = config;

  const sql = `update INT_PARAMETRIZACIONENVIOS set CODIGOMEDIOENVIO = ${codigomedioenvio}, EMAILREMITENTE = '${emailremitente}', PASSWORD1 = '${password}', SERVIDORSMTP =  '${servidorsmtp}', PUERTO= ${puerto}, TELEFONO = ${
    !numero ? 'null' : numero
  } where CODIGOPARAMETRIZACION = ${codigoparametrizacion}`;

  return new Promise((resolve, reject) => {
    firebird.attach(options, function (err, db) {
      if (err) reject({ status: 500, msg: err });

      db.query(sql, function (err, result) {
        if (err) reject({ status: 500, msg: err });

        // IMPORTANT: close the connection
        db.detach();

        resolve({
          status: 200,
          message: false,
          config: config,
        });
      });
    });
  });
};

module.exports = {
  newConfigService,
  getConfigsService,
  updateConfigService,
};
