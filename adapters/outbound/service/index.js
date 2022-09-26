const {
    adminServer,
    projectServer,
} = require('../../../infrastructure/otherServer');

const AdminService = require('./AdminService');
const ProjectService = require('./ProjectService');

module.exports = {
    adminService: new AdminService(adminServer),
    projectService: new ProjectService(projectServer),
};
