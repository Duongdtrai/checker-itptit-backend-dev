require('dotenv').config();

const HOST = process.env.MAIL_HOST;
const PORT = process.env.MAIL_PORT;
const USER_NAME = process.env.MAIL_USERNAME;
const PASSWORD = process.env.MAIL_PASSWORD;
const FORM_ADDRESS = process.env.MAIL_FROM_ADDRESS;

module.exports = {
  HOST,
  PORT,
  USER_NAME,
  PASSWORD,
  FORM_ADDRESS,
};
