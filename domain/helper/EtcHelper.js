module.exports = class Dater {
    constructor() {}
    // 메세지용 날짜 > 문자열 변환
    extractExtension(fileString) {
        let index = fileString.lastIndexOf('.');
        let extension = fileString.slice(index);
        return extension;
    }
    // 비밀번호 만료일 확인 함수
    checkExpiredPassword(updateAt) {
        const passwordExp = Number(updateAt) + 60 * 60 * 24 * 90;
        const now = Math.floor(new Date().valueOf() / 1000);
        return passwordExp < now ? true : false;
    }
};
