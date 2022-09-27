// 개별 공지사항 글 가져오기 : admin 서버 요청
module.exports = class GetEducationBoard {
    constructor(service) {
        this.service = service;
    }
    async excute(educationBoardData) {
        try {
            const { adminService } = this.service;
            const educationBoardInfo = await adminService.getEducationBoard(
                educationBoardData
            );
            return educationBoardInfo;
        } catch (error) {
            console.error(error);

            throw error;
        }
    }
};
