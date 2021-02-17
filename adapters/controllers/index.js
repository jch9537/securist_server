//컨트롤러 인터페이스 객체들
const userController = require('./userController');
const projectController = require('./projectController');
const userAuthController = require('./userAuthController');

module.exports = {
    userController: userController,
    projectController: projectController,
    userAuthController: userAuthController,
};
