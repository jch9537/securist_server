module.exports = class {
    constructor(message, name, code = 401) {
        this.message = message;
        this.name = name;
        this.code = code;
    }
};
