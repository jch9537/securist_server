// 게시된 공지사항 리스트 가져오기 : admin 요청
module.exports = class GetPostingAnnouncementBoards {
    constructor(service) {
        this.service = service;
    }
    async excute() {
        try {
            const { adminService } = this.service;

            const announcementBoardData = {
                postingState: 0, // 게시 상태만 가져오기
            };
            const postingAnnounceBoardList = await adminService.getPostingAnnouncementBoards(
                announcementBoardData
            );
            return postingAnnounceBoardList;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
};
