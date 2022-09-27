// 게시판 : admin 서버요청
const express = require('express');
const router = express.Router();

const { boardsAdapter } = require('../../../adapters/inbound');
const { GetAreaDto } = require('../../../adapters/dtos/requestDto/infoDto');
const { logger } = require('../../../adapters/module/logger');
const { SuccessResponse } = require('../../../adapters/response');

// 게시한 공지사항 리스트 가져오기
router.get('/announcement/posting', async (req, res, next) => {
    let result, response;
    try {
        console.log('요청 > GET > /api/user/boards/announcement/posting : ');
        result = await boardsAdapter.getPostingAnnouncementBoards();
        console.log(
            '응답 > GET > /api/user/boards/announcement/posting : ',
            result
        );
        response = new SuccessResponse(200, result);
        logger.log(
            'info',
            'GET /api/user/boards/announcement/posting',
            response.message
        );
        res.send(response);
    } catch (error) {
        // console.log('에러 > GET > /api/user/boards/announcement/posting: ', error);
        next(error);
    }
});
// 개별 공지사항 가져오기
router.get('/announcement/:announcementBoardId', async (req, res, next) => {
    let result, response;
    try {
        console.log(
            '요청 > GET > /api/user/boards/announcement/:announcementBoardId : '
        );

        const reqParamsData = req.params;
        result = await boardsAdapter.getAnnouncementBoard(reqParamsData);
        console.log(
            '응답 > GET > /api/user/boards/announcement/:announcementBoardId : ',
            result
        );
        response = new SuccessResponse(200, result);
        logger.log(
            'info',
            'GET /api/user/boards/announcement/:announcementBoardId',
            response.message
        );
        res.send(response);
    } catch (error) {
        // console.log('에러 > GET > /api/user/boards/announcement/:announcementBoardId: ', error);
        next(error);
    }
});

// 게시한 교육 게시글 리스트 가져오기
router.get('/education/posting', async (req, res, next) => {
    let result, response;
    try {
        console.log('요청 > GET > /api/user/boards/education/posting : ');
        result = await boardsAdapter.getPostingEducationBoards();
        console.log(
            '응답 > GET > /api/user/boards/education/posting : ',
            result
        );
        response = new SuccessResponse(200, result);
        logger.log(
            'info',
            'GET /api/user/boards/education/posting',
            response.message
        );
        res.send(response);
    } catch (error) {
        // console.log('에러 > GET > /api/user/boards/education/posting: ', error);
        next(error);
    }
});
// 개별 교육 게시글 가져오기
router.get('/education/:educationBoardId', async (req, res, next) => {
    let result, response;
    try {
        console.log(
            '요청 > GET > /api/user/boards/education/:educationBoardId : '
        );

        const reqParamsData = req.params;
        result = await boardsAdapter.getEducationBoard(reqParamsData);
        console.log(
            '응답 > GET > /api/user/boards/education/:educationBoardId : ',
            result
        );
        response = new SuccessResponse(200, result);
        logger.log(
            'info',
            'GET /api/user/boards/education/:educationBoardId',
            response.message
        );
        res.send(response);
    } catch (error) {
        // console.log('에러 > GET > /api/user/boards/education/:educationBoardId: ', error);
        next(error);
    }
});

module.exports = router;
