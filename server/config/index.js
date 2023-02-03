const dotenv = require('dotenv');
dotenv.config({ path: '.env' });

var options = {
  host: process.env.HOST,
  port: process.env.PORTFIREBIRD,
  database: process.env.DATABASE,
  user: process.env.USER,
  password: process.env.PASSWORD,
  lowercase_keys: false,
  role: null,
  pageSize: 4096,
};

module.exports = { options };
