// 모듈
const express = require('express');
const router = express.Router();
const qs = require('querystring');

// 미들웨어
const { logger } = require('../../../../adapters/module');

const { examLicenseIssuanceAdapter } = require('../../../../adapters/inbound');
const {
    CreateLicenseIssuanceDto,
    GetLicenseIssuanceListDto,
    GetLicenseIssuanceDto,
    UpdateLicenseIssuanceDto,
} = require('../../../../adapters/dtos/requestDto/examDto/licenseIssuanceDto');
const {
    AuthenticationException,
    AuthorizationException,
} = require('../../../../domain/exceptions');
const { SuccessResponse } = require('../../../../adapters/response');

//========================== 자격증 이력 =============================

// ------------------------ 사용자 페이지 ----------------------------

// 자격증 신청 정보 생성 : 사용자
router.post('/', async (req, res, next) => {
    console.log('요청 > POST > /api/admin/exam/issuance : ', req.session);
    try {
        // 테스트용 -----------------------------------------------
        // console.log('세션 확인 : ', req.session);
        // req.session.ci =
        //     '4MgVsM7B0e7SyRR0vb67KF+2DW7wbz8pDAkzf0QaKJMYONyzzRz/Ybv4WBDzt9d01acUWmQKmGLks0T0xp+MEA==';
        // 테스트용--------------------------------------------------------
        // 세션이 있고 본인인증에 성공한 경우 아니면 인증오류
        if (!(req.session && req.session.ci)) {
            throw new AuthenticationException();
        }
        const { issuanceData } = new CreateLicenseIssuanceDto(req.filteredBody);

        const result = await examLicenseIssuanceAdapter.createLicenseIssuance(
            issuanceData
        );
        // console.log('응답 > POST > /type/list : ', result);

        const response = new SuccessResponse(201, result);
        logger.log('info', 'POST /api/admin/exam/issuance', response.message);
        res.send(response);
    } catch (error) {
        // console.log('에러 > POST > /api/admin/exam/issuance : ', error);
        next(error);
    }
});

// 자격증 신청 리스트 가져오기 : 사용자
router.get('/', async (req, res, next) => {
    console.log(
        '요청 > GET > /api/admin/exam/issuance?examReceptionId : ',
        req.session
    );
    try {
        // // 테스트용 -----------------------------------------------
        // req.session.ci =
        //     '4MgVsM7B0e7SyRR0vb67KF+2DW7wbz8pDAkzf0QaKJMYONyzzRz/Ybv4WBDzt9d01acUWmQKmGLks0T0xp+MEA=='; // 테스트용
        // --------------------------------------------------------
        // 세션이 있고 본인인증에 성공한 경우 아니면 인증오류
        if (!(req.session && req.session.ci)) {
            throw new AuthenticationException();
        }

        const { issuanceData } = new GetLicenseIssuanceListDto(req.query);

        const result = await examLicenseIssuanceAdapter.getLicenseIssuanceByUser(
            issuanceData
        );
        // console.log('응답 > GET > /api/admin/exam/issuance/my : ', result);

        const response = new SuccessResponse(200, result);
        logger.log('info', 'GET /api/admin/exam/issuance/my', response.message);
        res.send(response);
    } catch (error) {
        // console.log('에러 > GET > /api/admin/exam/issuance/my : ', error);
        next(error);
    }
});

// 개별 자격증 신청 정보 가져오기 : 사용자
router.get('/:licenseIssuanceId', async (req, res, next) => {
    console.log(
        '요청 > GET > /api/admin/exam/issuance/my/:licenseIssuanceId : ',
        req.session
    );
    try {
        // 테스트용 -----------------------------------------------
        // req.session.ci =
        //     '4MgVsM7B0e7SyRR0vb67KF+2DW7wbz8pDAkzf0QaKJMYONyzzRz/Ybv4WBDzt9d01acUWmQKmGLks0T0xp+MEA==';
        // --------------------------------------------------------
        // 세션이 있고 본인인증에 성공한 경우 아니면 인증오류
        if (!(req.session && req.session.ci)) {
            throw new AuthenticationException();
        }

        const { issuanceData } = new GetLicenseIssuanceDto(req.params);
        const result = await examLicenseIssuanceAdapter.getLicenseIssuanceListByReceptionId(
            issuanceData
        );

        // console.log('응답 > GET > /api/admin/exam/issuance/my/:licenseIssuanceId : ', result);

        const response = new SuccessResponse(200, result);
        logger.log(
            'info',
            'GET /api/admin/exam/issuance/my/:licenseIssuanceId',
            response.message
        );

        res.send(response);
    } catch (error) {
        // console.log('에러 > GET > /api/admin/exam/issuance/my/:licenseIssuanceId : ', error);
        next(error);
    }
});
// 자격증 신청 정보 수정하기 : 사용자
router.put('/:licenseIssuanceId', async (req, res, next) => {
    console.log('요청 > PUT > /api/admin/exam/issuance/my : ', req.session);
    try {
        // 테스트용 -----------------------------------------------
        // req.session.ci =
        //     '4MgVsM7B0e7SyRR0vb67KF+2DW7wbz8pDAkzf0QaKJMYONyzzRz/Ybv4WBDzt9d01acUWmQKmGLks0T0xp+MEA==';
        // --------------------------------------------------------
        // 세션이 있고 본인인증에 성공한 경우 아니면 인증오류
        if (!(req.session && req.session.ci)) {
            throw new AuthenticationException();
        }

        const { issuanceData } = new UpdateLicenseIssuanceDto(req.filteredBody);

        const result = await examLicenseIssuanceAdapter.updateLicenseIssuanceByUser(
            issuanceData
        );
        // console.log('응답 > PUT > /api/admin/exam/issuance/my : ', result);

        const response = new SuccessResponse(204, result);
        logger.log('info', 'PUT /api/admin/exam/issuance/my', response.message);

        res.send(response);
    } catch (error) {
        // console.log('에러 > PUT > /api/admin/exam/issuance/my : ', error);
        next(error);
    }
});
// 자격증 발급 취소하기 : 사용자
router.put('/:licenseIssuanceId/cancel', async (req, res, next) => {
    console.log('요청 > PUT > /api/admin/exam/issuance/cancel : ', req.session);
    try {
        // 테스트용 -----------------------------------------------
        // req.session.ci =
        //     '4MgVsM7B0e7SyRR0vb67KF+2DW7wbz8pDAkzf0QaKJMYONyzzRz/Ybv4WBDzt9d01acUWmQKmGLks0T0xp+MEA==';
        // --------------------------------------------------------
        // 세션이 있고 본인인증에 성공한 경우 아니면 인증오류
        if (!(req.session && req.session.ci)) {
            throw new AuthenticationException();
        }

        const { issuanceData } = new GetLicenseIssuanceDto(req.filteredBody);

        const result = await examLicenseIssuanceAdapter.cancelLicenseIssuanceByUser(
            issuanceData
        );
        // console.log('응답 > PUT > /api/admin/exam/issuance/cancel : ', result);

        const response = new SuccessResponse(204, result);
        logger.log(
            'info',
            'PUT /api/admin/exam/issuance/cancel',
            response.message
        );

        res.send(response);
    } catch (error) {
        // console.log('에러 > PUT > /api/admin/exam/issuance/cancel : ', error);
        next(error);
    }
});

module.exports = router;
