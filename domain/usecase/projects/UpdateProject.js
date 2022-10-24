// module.exports = class UpdateProject {
//     constructor(repository) {
//         this.repository = repository;
//     }
//     async excute(projectData) {
//         try {
//             const { projectsRepository } = this.repository;

//             const projectsEntity = new ProjectsEntity(projectData);

//             await projectsRepository.updateProject(projectsEntity);
//             return;
//         } catch (error) {
//             console.error(error);
//             throw error;
//         }
//     }
// };
