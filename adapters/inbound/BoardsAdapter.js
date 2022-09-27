const { service } = require('../outbound');
const {
    GetPostingAnnouncementBoards,
    GetAnnouncementBoard,
} = require('../../domain/usecase/boards');
module.exports = class BoardsAdapter {
    constructor() {}

    // 게시한 공지사항 리스트 가져오기
    async getPostingAnnouncementBoards() {
        try {
            const getPostingAnnouncementBoards = new GetPostingAnnouncementBoards(
                service
            );
            const result = await getPostingAnnouncementBoards.excute();
            return result;
        } catch (error) {
            throw error;
        }
    }
    // 개별 공지사항 가져오기
    async getAnnouncementBoard(announcementData) {
        try {
            const getAnnouncementBoard = new GetAnnouncementBoard(service);
            const result = await getAnnouncementBoard.excute(announcementData);
            return result;
        } catch (error) {
            throw error;
        }
    }
};
