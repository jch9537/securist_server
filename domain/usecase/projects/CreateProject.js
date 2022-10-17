// module.exports = class CreateProject {
//     constructor(repository, service) {
//         this.repository = repository;
//         this.service = service;
//     }
//     async excute(projectData) {
//         const { projectsRepository } = this.repository;
//         const { userService, adminService } = this.service;

//         try {
//             const projectsEntity = new ProjectsEntity(projectData);

//             await projectsRepository.createProject(projectsEntity);
//             return;
//         } catch (error) {
//             console.error(error);
//             throw error;
//         }
//     }
// };
