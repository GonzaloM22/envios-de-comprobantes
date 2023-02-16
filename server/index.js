const express = require('express');
const cors = require('cors');
const app = express();
const { startCron } = require('./utils/cron');

startCron();
//Hanilitar template engine
app.set('view engine', 'pug');
app.set('views', './views');

require('dotenv').config();

app.use(cors());
const routes = require('./routes');

app.use(express.urlencoded({ limit: '5mb', extended: false }));
app.use(express.json({ limit: '5mb' }));

app.use('/api', routes);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
