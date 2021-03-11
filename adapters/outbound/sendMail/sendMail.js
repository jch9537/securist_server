module.exports = class {
    constructor(emailService) {
        this.emailService = emailService;
    }
    async sendConfirmMail(email) {
        let result = await this.emailService.sendCodeToEmail(email);
        return result;
    }
};
