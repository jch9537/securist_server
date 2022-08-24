// 임시 저장 업로드 파일 API
const express = require('express');
const router = express.Router();

const { uploadFilesInStorage } = require('../../../webService/storageService');
const { sanitizer } = require('../../middlewares');
const { tempUploadFilesAdapter } = require('../../../../adapters/inbound');

const {
    UpdateMyInfoRequestDto,
} = require('../../../../adapters/dtos/requestDto/myInfoDto');
const { logger } = require('../../../../adapters/module/logger');
const { SuccessResponse } = require('../../../../adapters/response');

// 프로필 임시저장 파일 정보 삭제
router.post('/', async (req, res, next) => {
    let result, response;
    try {
        let reqBodyData = req.filteredBody;

        console.log(
            'DELETE - /api/user/my/profile/temp/files 요청 : ',
            reqBodyData
        );

        result = await tempUploadFilesAdapter.deleteTempUploadFiles(
            reqBodyData
        );
        console.log('DELETE - /api/user/my/profile/temp/files 응답 : ', result);

        response = new SuccessResponse(204, result);
        logger.log(
            'info',
            'DELETE - /api/user/my/profile/temp/files',
            response.message
        );

        res.send(response);
    } catch (error) {
        console.error(
            'DELETE - /api/user/my/profile/temp/files 에러 응답 : ',
            error
        );
        next(error);
    }
});

module.exports = router;
