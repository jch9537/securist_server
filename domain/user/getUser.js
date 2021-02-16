module.exports = class {
    constructor(repository) {
        this.repository = repository;
    }
    excute({ email, password }) {
        console.log('Domain : createUser!!');
        this.repository.getUser({ email, password });
    }
};
