const {
    ConsultantUsersEntity,
    TempProfilesEntity,
    TempUploadFilesEntity,
    ProfilesEntity,
    // ProfileAbilityCertificationsEntity,
    // ProfileAbilityTasksEntity,
    // ProfileAbilityIndustriesEntity,
    ProfileEtcCertificationsEntity,
    ProfileAcademicBackgroundEntity,
    ProfileCareerEntity,
    ProfileLicenseEntity,
    ProfileProjectHistoryEntity,
    ProfileProjectHistoryTasksEntity,
    ProfileUploadFilesEntity,
} = require('../../entities');
const { UserTypeException } = require('../../exceptions');
module.exports = class CreateProfile {
    constructor(repository) {
        this.repository = repository;
    }
    async excute(userData, profileData, uploadData) {
        try {
            let {
                tempProfilesRepository,
                tempUploadFilesRepository,
                profilesRepository,
            } = this.repository;
            // userData.userType = 1; // 테스트용
            // if (userData.userType !== 1) {
            //     throw new UserTypeException('사용자 타입');
            // }

            // 이전에 저장한 임시저장 프로필이 있다면 가져오기
            const tempProfilesEntity = new TempProfilesEntity(userData);
            const preTempProfileInfo = await tempProfilesRepository.getTempProfile(
                tempProfilesEntity
            );

            if (!!preTempProfileInfo) {
                // 기존 업로드 파일 정보리스트  가져오기
                let tempUploadFilesEntity = new TempUploadFilesEntity(
                    preTempProfileInfo
                );
                const tempUploadFilesInfo = await tempUploadFilesRepository.getTempUploadFiles(
                    tempUploadFilesEntity
                );
                console.log('임시저장한 파일들 정보 ', tempUploadFilesInfo);
                // 새로운 업로드 파일과 병합
                uploadData = uploadData.concat(tempUploadFilesInfo);
                console.log('병합된 업로드 데이터 ', uploadData);
            }

            // 각 Entity 생성
            const consultantUsersEntity = new ConsultantUsersEntity(userData);
            consultantUsersEntity.phoneNum = profileData.phoneNum;
            consultantUsersEntity.profileStatus = 2; // 인증요청 상태로 변경
            // 프로필
            const profilesEntity = new ProfilesEntity(profileData);
            profilesEntity.consultantUserId = userData.consultantUserId; // 사용자 id
            // 수행 인증
            const profileAbilityCertificationIds = !profileData.abilityCertificationIds
                ? undefined
                : profileData.abilityCertificationIds;

            // 수행 과제 - 필수 항목
            const profileAbilityTaskIds = profileData.abilityTaskIds;
            // 기타 인증
            const profileEtcCertificationsEntity = new ProfileEtcCertificationsEntity(
                profileData
            );
            // 최종 학력 - 필수 항목
            const profileAcademicBackgroundEntity = new ProfileAcademicBackgroundEntity(
                profileData.academicBackground
            );
            // 경력
            const profileCareerEntities = !profileData.career
                ? undefined
                : profileData.career.map(
                      (careerData) => new ProfileCareerEntity(careerData)
                  );
            // 자격증
            const profileLicenseEntities = !profileData.license
                ? undefined
                : profileData.license.map(
                      (licenseData) => new ProfileLicenseEntity(licenseData)
                  );
            // 수행 이력
            const profileProjectHistoryEntities = !profileData.projectHistory
                ? undefined
                : profileData.projectHistory.map((projectHistoryData) => {
                      const profileProjectHistoryEntity = new ProfileProjectHistoryEntity(
                          projectHistoryData
                    );
                    // 수행 이력 내 담당 업무
                      if (projectHistoryData.assignedTasks) {
                          profileProjectHistoryEntity.assignedTasks = projectHistoryData.assignedTasks.map(
                              (assignedTask) =>
                                  new ProfileProjectHistoryTasksEntity(
                                      assignedTask
                                  )
                          );
                      }
                      return profileProjectHistoryEntity;
                  });
            const profileUploadFilesEntities = uploadData.map(
                (uploadData) => new ProfileUploadFilesEntity(uploadData)
            );

            // 프로필 정보 생성
            await profilesRepository.createProfile(
                consultantUsersEntity,
                profilesEntity,
                profileAbilityCertificationIds,
                profileAbilityTaskIds,
                profileEtcCertificationsEntity,
                profileAcademicBackgroundEntity,
                profileCareerEntities,
                profileLicenseEntities,
                profileProjectHistoryEntities,
                profileUploadFilesEntities
            );

            return;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
};
