// 게시된 공지사항 리스트 가져오기 : admin 요청
module.exports = class GetPostingEducationBoards {
    constructor(service) {
        this.service = service;
    }
    async excute() {
        try {
            const { adminService } = this.service;

            const educationBoardData = {
                postingState: 0, // 게시 상태만 가져오기
            };

            const postingEducationBoardsInfo = await adminService.getPostingEducationBoards(
                educationBoardData
            );
            return postingEducationBoardsInfo;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
};
