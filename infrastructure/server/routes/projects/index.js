// TODO 사용자 서버에서 인증 및 사용자 타입 및 사업자/프로필 인증 확인, 프로젝트 서버에서는 프로필 사용자인지 확인 필요
const express = require('express');
const router = express.Router();

const { projectsAdapter } = require('../../../../adapters/inbound');
const { logger } = require('../../../../adapters/module/logger');
const {
    EstimateProjectDto,
    CreateProjectDto,
} = require('../../../../adapters/dtos/requestDto/projectDto');
const { SuccessResponse } = require('../../../../adapters/response');

const { extractToken, decryptIdToken } = require('../../middlewares');

router.use(extractToken, decryptIdToken);

// 프로젝트 생성하기
router.post('/', async (req, res, next) => {
    console.log('요청 > POST > /api/project/projects/ : ');
    try {
        const userData = req.userDataByIdToken;
        const { projectData } = new CreateProjectDto(req.filteredBody);

        const result = await projectsAdapter.createProject(
            userData,
            projectData
        );
        console.log('응답 > POST > /api/project/projects/ : ', result);

        const response = new SuccessResponse(201, result);
        logger.log('info', 'GET - /api/project/projects/', response.message);

        res.send(response);
    } catch (error) {
        console.error('에러 > POST > /api/project/projects/: ', error);
        next(error);
    }
});

// 프로젝트 견적 계산
router.post('/estimate', async (req, res, next) => {
    console.log('요청 > POST > /api/project/projects/estimate : ');
    try {
        const userData = req.userDataByIdToken;
        const { projectData } = new EstimateProjectDto(req.filteredBody);

        const result = await projectsAdapter.estimateProject(
            userData,
            projectData
        );
        console.log('응답 > POST > /api/project/projects/estimate : ', result);

        const response = new SuccessResponse(200, result);
        logger.log(
            'info',
            'GET - /api/project/projects/estimate',
            response.message
        );

        res.send(response);
    } catch (error) {
        console.error('에러 > POST > /api/project/projects/estimate: ', error);
        next(error);
    }
});

// // 프로젝트 수정하기 - 사용자 X
// router.post('/', async (req, res, next) => {
//     console.log('GET - /api/project/projects/ 요청 : ');
//     try {
//         const result = await projectsAdapter.createProjects();
//         console.log('GET - /api/project/projects/ 응답 : ', result);

//         const response = new SuccessResponse(200, result);
//         logger.log('info', 'GET - /api/project/projects/', response.message);

//         res.send(response);
//     } catch (error) {
//         console.error('/api/project/projects/ 에러 응답 : ', error);
//         next(error);
//     }
// });

// 내 프로젝트 리스트 가져오기 - 클/컨 공통 > adapter 분기
router.get('/', async (req, res, next) => {
    console.log('GET - /api/project/projects/ 요청 : ');
    try {
        const result = await projectsAdapter.getProjects();
        console.log('GET - /api/project/projects/ 응답 : ', result);

        const response = new SuccessResponse(200, result);
        logger.log('info', 'GET - /api/project/projects/', response.message);

        res.send(response);
    } catch (error) {
        console.error('/api/project/projects/ 에러 응답 : ', error);
        next(error);
    }
});

// 선택 프로젝트 정보 가져오기 - 사용자
router.get('/:projectId', async (req, res, next) => {
    console.log('요청 > GET > /api/project/projects/:projectId : ', req.params);
    try {
        const reqParamData = req.params;

        const result = await projectsAdapter.getProject(reqParamData);
        console.log('응답 > GET > /api/project/projects/:projectId : ', result);

        const response = new SuccessResponse(200, result);
        logger.log(
            'info',
            'GET - /api/project/projects/:projectId',
            response.message
        );

        res.send(response);
    } catch (error) {
        console.error('에러 > GET > /api/project/projects/:projectId: ', error);
        next(error);
    }
});

module.exports = router;
