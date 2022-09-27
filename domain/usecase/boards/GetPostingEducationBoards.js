// 게시된 공지사항 리스트 가져오기 : admin 요청
module.exports = class GetPostingEducationBoards {
    constructor(service) {
        this.service = service;
    }
    async excute() {
        try {
            const { adminService } = this.service;

            const postingEducationBoardsInfo = await adminService.getPostingEducationBoards();
            return postingEducationBoardsInfo;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
};
