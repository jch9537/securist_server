// 개별 공지사항 글 가져오기 : admin 서버 요청
module.exports = class GetAnnouncementBoard {
    constructor(service) {
        this.service = service;
    }
    async excute(announcementData) {
        try {
            const { adminService } = this.service;
            const announceBoardInfo = await adminService.getAnnouncementBoard(
                announcementData
            );
            return announceBoardInfo;
        } catch (error) {
            console.error(error);

            throw error;
        }
    }
};
