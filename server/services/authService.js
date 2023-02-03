//const Firebird = require('node-firebird');
var firebird = require('node-firebird-dialect1');
const { options } = require('../config');

const loginService = async (user, password) => {
  let result;

  const sql = `select u.codigousuario, u.password1 from usuarios u where u.codigousuario = '${user}' and u.password1 = '${password}' and u.activo = 1`;

  return new Promise((resolve, reject) => {
    firebird.attach(options, function (err, db) {
      if (err) reject({ status: 500, message: err });

      db.query(sql, function (err, result) {
        if (result.length === 0)
          reject({ status: 404, message: 'User not found' });

        // IMPORTANT: close the connection
        db.detach();

        resolve({
          status: 200,
          message: 'Login successful',
          //token: createToken(user),
        });
      });
    });
  });

  try {
    const user = await User.findOne({ email });
    if (!user) return (result = { status: 404, message: 'user not found' });

    if (!(password && user.comparePassword(password)))
      return (result = { status: 401, message: 'user or password incorrect' });

    result = {
      status: 200,
      message: 'Login successful',
      token: createToken(user),
    };
  } catch (error) {
    //console.log(error);
  }

  return result;
};

module.exports = { loginService };
