module.exports = class {
    constructor(paramType) {
        this.code = 403;
        this.message = `${paramType} 에러.`;
    }
};
