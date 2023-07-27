/**
 * Logging service
 */

const morgan = require('morgan');
const util = require('util');

const showDate = () => {
  const d = new Date();
  return d.toISOString();
};

const formatArgs = (args) => {
  return util.format.apply(util.format, Array.prototype.slice.call(args));
};

// Ref: https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color
const COLORS = {
  reset: '\x1b[0m',
  dim: '\x1b[2m',
  fgBlack: '\x1b[30m',
  fgRed: '\x1b[31m',
  fgGreen: '\x1b[32m',
  fgYellow: '\x1b[33m',
  fgBlue: '\x1b[34m',
  fgMagenta: '\x1b[35m',
  fgCyan: '\x1b[36m',
  fgWhite: '\x1b[37m',
  fgCrimson: '\x1b[38m',
  bgBlack: '\x1b[40m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgWhite: '\x1b[47m',
  bgCrimson: '\x1b[48m',
};

const textColor = (text, fgColor = 'reset', bgColor = 'reset') => {
  return COLORS[bgColor] + COLORS[fgColor] + text + COLORS.reset;
};

// ACCESS LOG
const serverLogger = morgan(
  textColor('[:date[iso]]', 'fgCyan') +
    textColor(' REQ/  ', 'fgYellow') +
    textColor(
      ':method :url HTTP/:http-version :status :res[content-length] :response-time ms - ":referrer" ":user-agent" - :remote-addr',
      'dim'
    )
);

// APP LOGS
// Overrided: console.log
const originLog = console.log;
console.log = function () {
  originLog(
    textColor('[' + showDate() + ']', 'fgCyan') +
      textColor(' LOG/  ', 'fgMagenta') +
      formatArgs(arguments)
  );
};

// Override: console.info
const originInfo = console.info;
console.info = function () {
  originInfo(
    textColor('[' + showDate() + ']', 'fgCyan') +
      textColor(' INF/  ', 'fgGreen') +
      formatArgs(arguments)
  );
};

// Override: console.error
const originError = console.error;
console.error = function () {
  originError(
    textColor('[' + showDate() + ']', 'fgCyan') +
      textColor(' ERR/  ', 'fgRed') +
      textColor(formatArgs(arguments), 'fgRed')
  );
};

// Override: console.debug
const originDebug = console.debug;
console.debug = function () {
  originDebug(
    textColor('[' + showDate() + ']', 'fgCyan') +
      textColor(' DBG/  ', 'fgYellow') +
      formatArgs(arguments)
  );
};

module.exports = {
  serverLogger,
};
