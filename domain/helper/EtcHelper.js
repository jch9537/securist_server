module.exports = class Dater {
    constructor() {}
    // 메세지용 날짜 > 문자열 변환
    extractExtension(fileString) {
        let index = fileString.lastIndexOf('.');
        let extension = fileString.slice(index);
        return extension;
    }
};
