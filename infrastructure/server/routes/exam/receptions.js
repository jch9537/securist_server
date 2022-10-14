const express = require('express');
const router = express.Router();
const qs = require('querystring');
// const session = require('express-session');
// const RedisStore = require('connect-redis')(session);

// const { createClient } = require('redis');
// let redisClient = createClient();

const niceRouter = require('./nice');

const { sanitizer } = require('../../middlewares');
const { logger } = require('../../../../adapters/module');
const { examReceptionsAdapter } = require('../../../../adapters/inbound');

const { uploadFilesInStorage } = require('../../../webService/storageService');
const {
    // 접수
    CreateExamReceptionRequestDto,
    GetExamReceptionRequestDto,
    UpdateExamReceptionRequestDto,
} = require('../../../../adapters/dtos/requestDto/examDto/receptionDto');
const {
    CreateUploadFilesDto,
} = require('../../../../adapters/dtos/requestDto/uploadFilesDto');
const { SuccessResponse } = require('../../../../adapters/response');
const {
    AuthenticationException,
    AuthorizationException,
} = require('../../../../domain/exceptions');

// const { extractToken, decryptIdToken } = require('../../middlewares');
//======================== SECURIST 자격증 APIs ========================

// router.use(
//     session({
//         saveUninitialized: false, // 수정되지 않은 새 세션 저장 여부 - true: 저장
//         secret: process.env.SESSION_SECRET,
//         resave: false, //세션 저장하고 불러올 때 다시 저장할지 여부
//         cookie: {
//             httpOnly: true,
//             // secure: true, //https 환경에서만 session 정보를 주고받도록처리
//             maxAge: 1000 * 60 * 10, // 만료시간
//             domain: 'securist.co.kr', // 도메인
//         },
//         store: new RedisStore({ client: redisClient }), // redis stroage 사용
//     })
// );

router.use('/nice', niceRouter); // 본인 인증

//------------------ 자격증 수험자  API : 권한 필요 없음 --------------------------

// 시험 접수 정보 생성하기 : 사용자
router.post(
    '/',
    uploadFilesInStorage.array('reception', 3), // 3개까지 업로드 > 1개만 필요 시 .single('reception')로 변경
    sanitizer,
    async (req, res, next) => {
        try {
            let uploadFiles;
            if (req.filteredBody.examType === 1) {
                // 1급 자격 필수 자료
                uploadFiles = new CreateUploadFilesDto(req.files);
            }
            console.log(
                '업로드 파일들 > POST > /api/admin/exam/receptions : ',
                uploadFiles
            );

            const { receptionData } = new CreateExamReceptionRequestDto(
                req.filteredBody
            );
            console.log(
                '요청 > POST > /api/admin/exam/receptions : ',
                receptionData
            );

            const result = uploadFiles
                ? await examReceptionsAdapter.createExamReception(
                      receptionData,
                      uploadFiles.uploadFilesData
                  )
                : await examReceptionsAdapter.createExamReception(
                      receptionData
                  );
            console.log('응답 > POST > /api/admin/exam/receptions : ', result);

            const response = new SuccessResponse(200, result);
            logger.log(
                'info',
                'POST /api/admin/exam/receptions',
                response.message
            );
            res.send(response);
        } catch (error) {
            // // console.log('에러 > POST > /api/admin/exam/receptions: ', error);
            next(error);
        }
    }
);
// 사용자의 접수 정보 리스트 가져오기 : 사용자 (세션값 - ci)
router.get('/my', async (req, res, next) => {
    try {
        // 테스트용 -----------------------------------------------
        console.log('세션 확인 : ', req.session);
        // req.session.ci =
        //     'ED0ltUG7ngRP3x9T8pWJQy5q5gwDYV9uJU6Xc+Ss7a8m18WULmpyI0sMFQQuN3SAQp9gqsHidMntqo8Nnu2s2g==';
        //     '4MgVsM7B0e7SyRR0vb67KF+2DW7wbz8pDAkzf0QaKJMYONyzzRz/Ybv4WBDzt9d01acUWmQKmGLks0T0xp+MEA=='; // 테스트용
        // --------------------------------------------------------
        // 세션이 있고 본인인증에 성공한 경우 아니면 인증오류
        if (!(req.session && req.session.ci)) {
            throw new AuthenticationException();
        }
        console.log('세션값 확인 : ', req.session);

        const { receptionData } = new GetExamReceptionRequestDto(
            req.filteredQuery
        );
        receptionData.ci = req.session.ci;
        console.log(
            '요청 > GET > /api/admin/exam/receptions/my : ',
            receptionData
        );

        const result = await examReceptionsAdapter.getReceptionList(
            receptionData
        );
        // console.log(
        //     '응답 > GET > /api/admin/exam/receptionreceptions/my : ',
        //     result
        // );
        const response = new SuccessResponse(200, result);
        logger.log(
            'info',
            'GET /api/admin/exam/receptionreceptions/my',
            response.message
        );

        res.send(response);
    } catch (error) {
        // console.log('에러 > GET > /api/admin/exam/receptionreceptions/my : ', error);
        next(error);
    }
});
// 내 개별 접수 정보 가져오기 : 사용자 - ci
router.get('/my/:examReceptionId', async (req, res, next) => {
    try {
        // 테스트용 -----------------------------------------------
        console.log('세션 확인 : ', req.session);
        // req.session.ci =
        //     '4MgVsM7B0e7SyRR0vb67KF+2DW7wbz8pDAkzf0QaKJMYONyzzRz/Ybv4WBDzt9d01acUWmQKmGLks0T0xp+MEA=='; // 테스트용
        // --------------------------------------------------------
        // 세션이 있고 본인인증에 성공한 경우 아니면 인증오류
        if (!(req.session && req.session.ci)) {
            throw new AuthenticationException();
        }

        const { receptionData } = new GetExamReceptionRequestDto(req.params);
        receptionData.ci = req.session.ci;
        console.log(
            '요청 > GET > /api/admin/exam/receptions/my/:examReceptionId : ',
            receptionData
        );

        const result = await examReceptionsAdapter.getExamReception(
            receptionData
        );
        console.log({ result });
        // console.log('응답 > GET > /api/admin/exam/receptions/my/:examReceptionId : ', result);

        const response = new SuccessResponse(200, result);
        logger.log(
            'info',
            'GET /api/admin/exam/receptions/my/:examReceptionId',
            response.message
        );

        res.send(response);
    } catch (error) {
        console.log('result', { error });
        // console.log('에러 > GET > /api/admin/exam/receptions/my/:examReceptionId : ', error);
        next(error);
    }
});
// 이메일 수정 : 사용자
router.put('/my/email', async (req, res, next) => {
    try {
        console.log('세션정보 확인 : ', req.session);
        // 세션이 있고 본인인증에 성공한 경우 아니면 인증오류
        if (!(req.session && req.session.ci)) {
            throw new AuthenticationException();
        }

        const { receptionData } = new UpdateExamReceptionRequestDto(
            req.filteredBody
        );
        receptionData.ci = req.session.ci;
        console.log(
            '요청 > PUT > /api/admin/exam/receptions/my/email : ',
            receptionData
        );

        const result = await examReceptionsAdapter.updateMyEmail(receptionData);
        // console.log('응답 > PUT > /api/admin/exam/receptions/my/email : ', result);

        const response = new SuccessResponse(204, result);

        logger.log(
            'info',
            'PUT /api/admin/exam/receptions/my/email',
            response.message
        );
        res.send(response);
    } catch (error) {
        // console.log('에러 > PUT > /api/admin/exam/receptions/my/email: ', error);
        next(error);
    }
});

// //  배송 정보(수령인, 수령인 연락처, 주소) 추가(수정)하기 : 사용자
// // => 경로수정 필요 - /reception     & body에 updateType : 'delivery' 추가
// router.put('/delivery', async (req, res, next) => {
//     let result, response;
//     try {
//         console.log('세션정보 확인 : ', req.session);
//         // 세션이 있고 본인인증에 성공한 경우 아니면 인증오류
//         if (!(req.session && req.session.ci)) {
//             throw new AuthenticationException();
//         }

//         let { receptionData } = new UpdateExamReceptionRequestDto(
//             req.filteredBody
//         );
//         receptionData.ci = req.session.ci;
//         console.log(
//             '요청 > PUT > /api/admin/exam/receptions/delivery : ',
//             receptionData
//         );

//         result = await examReceptionsAdapter.updateDeliveryRequest(
//             receptionData
//         );
//         // console.log('응답 > PUT > /api/admin/exam/receptions/delivery : ', result);

//         response = new SuccessResponse(204, result);

//         logger.log(
//             'info',
//             'PUT /api/admin/exam/receptions/delivery',
//             response.message
//         );
//         res.send(response);
//     } catch (error) {
//         // console.log('에러 > PUT > /api/admin/exam/receptions/delivery: ', error);
//         next(error);
//     }
// });

// 접수 취소 (삭제)하기 : 사용자
router.put(
    '/cancel',
    // uploadRefundAccount.single('refund'),
    // sanitizer,
    async (req, res, next) => {
        try {
            console.log('세션정보 : ', req.headers);
            // 테스트용 -----------------------------------------------
            // req.session.ci =
            //     '4MgVsM7B0e7SyRR0vb67KF+2DW7wbz8pDAkzf0QaKJMYONyzzRz/Ybv4WBDzt9d01acUWmQKmGLks0T0xp+MEA=='; // 테스트용
            // console.log('테스트 세션정보 확인 : ', req.session);
            // // --------------------------------------------------------

            // 세션이 있고 본인인증에 성공한 경우 아니면 인증오류
            if (!(req.session && req.session.ci)) {
                throw new AuthenticationException();
            }

            const { receptionData } = new UpdateExamReceptionRequestDto(
                req.filteredBody
            );
            receptionData.ci = req.session.ci;
            console.log(
                '요청 > PUT(cancel) > /api/admin/exam/receptions/:examReceptionId : ',
                receptionData
            );

            const result = await examReceptionsAdapter.cancelExamReception(
                receptionData
            );
            // console.log('응답 > PUT(cancel) > /receptions/:examReceptionId : ', result);

            const response = new SuccessResponse(204, result);

            logger.log(
                'info',
                'PUT /api/admin/exam/receptions/cancel',
                response.message
            );
            res.send(response);
        } catch (error) {
            // console.log('에러 > PUT(cancel) > /api/admin/exam/receptions/:examReceptionId: ', error);
            next(error);
        }
    }
);

module.exports = router;
