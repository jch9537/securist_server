module.exports = class {
    constructor(db) {
        this.db = db;
    }
    createUser(userEntity) {
        console.log('Repository: createUser!!', userEntity);
    }
    getUser(userEntity) {
        console.log('Repository: getUser!!', userEntity);
    }
};
