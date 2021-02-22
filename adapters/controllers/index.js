//컨트롤러 인터페이스 객체들
const userController = require('./userAdaptor');
const projectController = require('./projectAdaptor');
const userAuthController = require('./userAuthAdaptor');

module.exports = {
    userController: userController,
    projectController: projectController,
    userAuthController: userAuthController,
};
