// 다른 저장소(Redis) 오류
module.exports = class StorageError extends Error {
    constructor(message, code) {
        super();
        // 로그용 데이터
        this.location = `Storage`; // 에러 발생 위치 : 로그
        this.message = message; // 메세지
        this.code = code;
        // 클라이언트 응답 데이터
        this.statusCode = 500;
        this.errMessage = undefined;
    }
};
