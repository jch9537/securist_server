// 업로드: S3
const express = require('express');
const router = express.Router();

const { logger } = require('../../../adapters/module');
const { storageAdapter } = require('../../../adapters/inbound');
const { SuccessResponse } = require('../../../adapters/response');
const {
    DeleteUploadFilesDto,
} = require('../../../adapters/dtos/requestDto/uploadFilesDto');

// 업로드 파일 삭제
router.post('/removal', async (req, res, next) => {
    try {
        let { uploadFilesData } = new DeleteUploadFilesDto(req.filteredBody);
        console.log('POST > /user/files/removal 요청 : ', uploadFilesData);

        const result = await storageAdapter.deleteUploadFilesInStorage(
            uploadFilesData
        );

        console.log('POST > /admin/files/removal 응답 : ', result);
        const response = new SuccessResponse(202, result);
        logger.log('info', 'POST /admin/files/removal', response.message);
        res.send(response);
    } catch (error) {
        console.log('POST > /admin/files/removal 에러 응답 : ', error);
        next(error);
    }
});

module.exports = router;
