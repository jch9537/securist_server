module.exports = class {
    constructor(errMessage, code, errStack) {
        this.errMessage = errMessage;
        this.code = code;
        this.errStack = errStack;
    }
};
