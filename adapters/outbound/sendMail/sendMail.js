module.exports = class {
    constructor(emailService) {
        this.emailService = emailService;
    }
    sendMail(email) {
        console.log('Outbound SendMail: sendMail!!', email);
        console.log(this.emailService.ses);
        // this.service.emailService
    }
};
