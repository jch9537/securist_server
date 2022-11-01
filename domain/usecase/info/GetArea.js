module.exports = class GetArea {
    constructor(service) {
        this.service = service;
    }
    async excute(regionData) {
        try {
            const { adminService } = this.service;
            const areaList = await adminService.getArea(regionData);

            return areaList;
        } catch (error) {
            throw error;
        }
    }
};
