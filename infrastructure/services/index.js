const ProjectService = require('./ProjectService');
const AdminService = require('./AdminService');

module.exports = {
    projectService: new ProjectService(),
    adminService: new AdminService(),
};
