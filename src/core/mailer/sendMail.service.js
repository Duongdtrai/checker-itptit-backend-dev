const nodeMailer = require('nodemailer');
const {
  HOST,
  USER_NAME,
  PASSWORD,
  FORM_ADDRESS,
  PORT,
} = require('./sendMail.constants');

const sendMail = async (to, subject, htmlContent) => {
  try {
    const transport = await nodeMailer.createTransport({
      host: HOST,
      port: PORT,
      secure: true,
      auth: {
        user: USER_NAME,
        pass: PASSWORD,
      },
    });

    const options = {
      from: FORM_ADDRESS,
      to,
      subject,
      html: htmlContent,
    };

    return transport.sendMail(options);
  } catch (error) {
    console.log(error);
  }
};

module.exports = sendMail;
