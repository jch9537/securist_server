const { projectController } = require('../../../adapters/controllers');

module.exports = (router) => {
    router.get('/project/:projectId', (req, res) =>
        projectController.getProject(req, res)
    );
    router.post('/project', (req, res) =>
        projectController.createProject(req, res)
    );
    router.put('/project/:projectId', (req, res) =>
        projectController.updateProject(req, res)
    );
    router.delete('/project/:projectId', (req, res) =>
        projectController.deleteProject(req, res)
    );
};
