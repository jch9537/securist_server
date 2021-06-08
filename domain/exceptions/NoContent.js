module.exports = class {
    constructor(paramType) {
        this.code = 404;
        this.message = `${paramType} 존재하지 않습니다.`;
    }
};
