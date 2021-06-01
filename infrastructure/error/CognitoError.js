module.exports = class {
    constructor(code, errMessage, errStack) {
        this.code = code;
        this.errMessage = errMessage;
        this.errStack = errStack;
    }
};
