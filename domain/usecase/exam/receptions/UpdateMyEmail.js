module.exports = class UpdateMyEmail {
    constructor(service) {
        this.service = service;
    }
    async excute(receptionData) {
        try {
            const { adminService } = this.service;
            const updateMyEmail = await adminService.updateMyEmail(
                receptionData
            );
            return updateMyEmail;
        } catch (error) {
            throw error;
        }
    }
};
