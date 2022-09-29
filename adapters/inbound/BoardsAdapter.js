const { service } = require('../outbound');
const {
    GetPostingAnnouncementBoards,
    GetAnnouncementBoard,
    GetPostingEducationBoards,
    GetEducationBoard,
} = require('../../domain/usecase/boards');
module.exports = class BoardsAdapter {
    constructor() {}

    // 공지사항 -----------------------------------
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

    // 교육 게시판 -------------------------------
    // 게시한 교육게시글 리스트 가져오기
    async getPostingEducationBoards() {
        try {
            const getPostingEducationBoards = new GetPostingEducationBoards(
                service
            );
            const result = await getPostingEducationBoards.excute();
            return result;
        } catch (error) {
            throw error;
        }
    }
    // 개별 교육게시글 가져오기
    async getEducationBoard(educationBoardData) {
        try {
            const getEducationBoard = new GetEducationBoard(service);
            const result = await getEducationBoard.excute(educationBoardData);
            return result;
        } catch (error) {
            throw error;
        }
    }
};
