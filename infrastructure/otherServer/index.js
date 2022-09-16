const ProjectServer = require('./ProjectServer');
const AdminServer = require('./AdminServer');

module.exports = {
    projectServer: new ProjectServer(),
    adminServer: new AdminServer(),
};
