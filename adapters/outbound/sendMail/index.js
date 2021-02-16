const SendMail = require('./sendMail');
const EmailService = require('../../../infrastructure/webService/emailService');

const emailService = new EmailService();

module.exports = new SendMail(emailService); //parameter: emailService
