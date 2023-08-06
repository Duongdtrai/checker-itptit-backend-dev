require('dotenv').config();

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

app.use(helmet());
app.use(bodyParser.json()); // application/json
app.use('/', express.static(path.join(__dirname, 'public', 'images')));

const { serverLogger } = require('./core/logging/logger');

const whiteList = ['*'];

//CORS
// app.use(
//   cors({
//     origin: whiteList,
//     credentials: true,
//   })
// );
app.use(cors())

/** Init 'itptit' - global application manager */
global.itptit = {};

/** Init database manager */
const database = require('../src/core/database/models');
global.itptit.db = database;

const testRoutes = require('./routes/test/index');

/** Init router ultility */
const routerUtil = require('./routes');
const authentication = require('./middleware/authentication');
const activeToken = require('./middleware/active-token');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

app.use('/test', testRoutes);
app.use('/api', [
  authentication,
  activeToken,
  routerUtil.routerFile(path.join(__dirname, './api')),
]);

//Error handler
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;

  res.status(status).json({
    message: message,
    data: data,
  });
});

app.use(serverLogger);

const runTimeConfig = {
  launchedAt: Date.now(),
  appPath: process.cwd(),
  appVersion: process.env.VERSION,
  host: process.env.SERVER_HOST,
  port: process.env.PORT,
  environment: process.env.NODE_ENV,
};

app.listen(runTimeConfig.port, (error) => {
  if (error) {
    console.log("⚠️ Server wasn't able to start properly.");
    console.error(err);
    return;
  }
  console.log('=========================================================');
  console.info('Time: ' + new Date());
  console.info(
    'Launched in: ' + (Date.now() - runTimeConfig.launchedAt) + ' ms'
  );
  console.info('Environment: ' + runTimeConfig.environment);
  console.info('Process PID: ' + process.pid);
  console.info('App path: ' + runTimeConfig.appPath);
  console.info('App version: ' + runTimeConfig.appVersion);
  console.info('To shut down your server, press <CTRL> + C at any time');
  console.log('=========================================================');
  console.info(`⚡️ Server: ${runTimeConfig.host}:${runTimeConfig.port}`);
  console.log('=========================================================');
  console.log(`Example app listening on port ${runTimeConfig.port}!`);
});
